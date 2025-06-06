import { FormItems } from "../../shared/FormItems";
import { Input } from "../../shared/Input/Input";
import { TextArea } from "../../shared/TextArea/TextArea";
import { zCreateReviewTrpcInput } from "@bookkey/backend/src/router/reviews/createReview/input";
import { ActionButton, Button } from "../../shared/Button";
import { Alert } from "../../shared/Alert";
import { trpc } from "../../../lib/trpc";
import React, { useState, useEffect } from "react";
import { Segment } from "../../shared/Segment/segment";
import css from './index.module.scss';
import { zUpdateReviewTrpcInput } from "@bookkey/backend/src/router/reviews/updateReview/input";
import { useForm } from "../../../lib/form";
import { useMe } from "../../../lib/ctx";
import type { TrpcRouterOutput } from "@bookkey/backend/src/router";
import { canBlockContent } from "@bookkey/backend/src/utils/can";
import { Icon } from "../../shared/Icons";
import { getAvatarUrl } from "@bookkey/shared/src/cloudinary";
import { mixpanelSetReviewLike } from "../../../lib/mixpanel";
import { Tooltip } from "react-tooltip";

const LikeButton = ({review}: {review: NonNullable<TrpcRouterOutput['getReview']['review']>}) => {
    const prevGetReviewData = trpc.getReview.useQuery({ id: review.id! })
    const trpcUtils = trpc.useUtils();
    const setReviewLike = trpc.setReviewLike.useMutation({
        onMutate: ({ likedByCurrUser }) => {
            // const prevGetReviewData = trpc.getReview.useQuery({ id: review.id! })
            // console.log(prevGetReviewData)
            if (prevGetReviewData.data!.review) {
                const newGetReviewData = {
                    ...prevGetReviewData.data!.review,
                    review: {
                        ...prevGetReviewData.data!.review,
                        likedByCurrUser,
                        // likesCount: prevGetReviewData.review.likesCount + (likedByCurrUser ? 1 : -1)
                        likesCount: prevGetReviewData.data!.review.likesCount
                    }
                }
                trpcUtils.getReview.setData({ id: review.id! }, newGetReviewData)
            }
        },
        onSuccess: () => {
            void trpcUtils.getReviews.invalidate()
        }
    })
    return (
        <button
            className={css.likeButton}
            onClick={() => {
                void setReviewLike.mutateAsync({ reviewId: review.id!, likedByCurrUser: !review.isLikedByCurrUser  })
                    .then(() => {
                        if (!review.isLikedByCurrUser) {
                            mixpanelSetReviewLike({id: review.id!, likedByCurrUser: review.isLikedByCurrUser, likesCount: review.likesCount})
                        }
                    })
            }}
        >
            <Icon size={32} className={css.likeIcon} name={review.isLikedByCurrUser ? 'liked' : 'notLiked'}></Icon>
        </button>
    )
}

const BlockReview = ({ review }: { review: NonNullable<TrpcRouterOutput['getReview']['review']> }) => {
    const blockReview = trpc.blockReview.useMutation();
    const trpcUtils = trpc.useUtils();
    const { formik, alertProps, buttonProps } = useForm({
        onSubmit: async () => {
            await blockReview.mutateAsync({ reviewId: review.id! })
            void trpcUtils.getReviews.invalidate();
        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormItems>
                <Alert {...alertProps} />
                <Button color="red" {...buttonProps}>Block</Button>
            </FormItems>
        </form>
    )
}

export const NewReview = (props: any) => {
    const me = useMe();
    const createReview = trpc.createReview.useMutation();
    const updateReview = trpc.editReview.useMutation();
    const reviewResults = trpc.getReviews.useQuery({bookId: props.bookResult.id!}, {enabled: !!props.bookResult.id})
    const [reviews, setReviews] = useState<TrpcRouterOutput['getReviews']['reviews']>([]);
    const [reviewCurrUserExists, setReviewCurrUserExists] = useState(false);
    const [editOrCreate, setEditOrCreate] = useState('Create Review');
    const [isEditing, setIsEditing] = useState(false);
    const [reviewByCurrUserId, setReviewByCurrUserId] = useState('');
    let formikEdit = useForm({
        initialValues: {
            title: '',
            score: 5,
            text: '',
            userId: me?.id || '',
            bookId: '',
        },
        validationSchema: zUpdateReviewTrpcInput.omit({reviewId: true}),
        onSubmit: async (values) => {
            await updateReview.mutateAsync({ reviewId: reviewByCurrUserId, ...values });
            // if no problem occur, it will proceed
            formikEdit.formik.resetForm();
            // setSuccessMessageVisible(true);
            reviewResults.refetch();
            // setTimeout(() => {
            //     setSuccessMessageVisible(false)
            // }, 3000)
            setTimeout(() => {
                setIsEditing(false);
            }, 3000)
            // setIsEditing(false);
            setEditOrCreate("Create Review")        
        },
        successMessage: "Review updated successfully!",
        showValidationAlert: true,
    })
    let formikCreate = useForm({
        initialValues: {
            title: '',
            score: 5,
            text: '',
            userId: me?.id || '',
            bookId: props.bookResult.id || ''
        },
        validationSchema: zCreateReviewTrpcInput,
        onSubmit: async (values) => {
            await createReview.mutateAsync(values);
            // if no problem occur, it will proceed
            formikCreate.formik.resetForm();
            // setSuccessMessageVisible(true);
            reviewResults.refetch();
            // setTimeout(() => {
            //     setSuccessMessageVisible(false)
            // }, 3000)
        },
        successMessage: "Create review successfully!",
        showValidationAlert: true,
    })

    const reviewMadeByCurrUser = (review: any) => {
        return review.userId === me?.id;
    }

     // Change initial value for forms on userId and bookId once getting results from trpc call
    useEffect(() => {
        if (props.bookResult.id) {
            formikCreate.formik.setFieldValue("bookId", props.bookResult.id)
        }}, [props.bookResult])
    
    useEffect(() => {
        if (reviewResults.data) {
            setReviews(reviewResults.data.reviews)
            setReviewCurrUserExists(() => {
                return checkReviewByUserExists() || false;
            })
        }
    }, [reviewResults.data?.reviews])

    const editReview = (review: any) => {
        setReviewByCurrUserId(review.id);
        setReviewCurrUserExists(false);
        setIsEditing(true);
        setEditOrCreate('Edit Review');
        formikEdit.formik.setValues({...review})
    }

    const AllReviews = reviews?.map((review) => {
        return (
            <div className={css.review} key={review.id}>
                <img className={css.avatar} src={getAvatarUrl(review.user.avatar, 'small')} alt="" />
                <Segment title={review.title} description={`by: ${review.user.username}`}>
                    <div className={css.content}>
                        <div 
                            data-tooltip-id="score-tooltip"
                            data-tooltip-content={review.score.toString()}
                            data-tooltip-place="bottom" 
                            className={css.stars}>
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    name="star"
                                    className={css.starIcon}
                                    style={{ color: i < review.score ? 'var(--yellow)' : '#ccc' }}
                                    size={20}
                                />
                            ))}
                        </div>
                        <Tooltip id="score-tooltip" />

                        <div className={css.text}>
                            {review.text.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </div>
                        {me && (
                            <div className={css.likes}>
                                <LikeButton review={review} />
                                <span className={css.likeCount}>{review.likesCount}</span>
                            </div>
                        )}
                        <div className={css.actions}>
                            {reviewMadeByCurrUser(review) && !isEditing && (
                                <ActionButton action={() => editReview(review)}>Edit</ActionButton>
                            )}
                            {canBlockContent(me) && <BlockReview review={review} />}
                        </div>
                    </div>
                </Segment>
            </div>
        )
    })

    const checkReviewByUserExists = () => {
        return reviewResults.data?.reviews.some((review) => {
            return (review.userId === me?.id)
        })
    }
    
    return (
        <div className={css.wholeReview}>
            {me && <h3 className={css.header}>{editOrCreate}</h3>}
            {isEditing && <div>
                {me?.id && props.bookResult && <form onSubmit={(e) => {
                    e.preventDefault();
                    formikEdit.formik.handleSubmit();
                    }}>
                    <FormItems>
                        <Input
                            key="title"
                            name="title"
                            label="Title"
                            formik={formikEdit.formik}
                            existed={false}
                        />
                        <Input
                            key="score"
                            name="score"
                            label="Score"
                            formik={formikEdit.formik}
                            existed={false}
                        >
                        </Input>
                        <TextArea
                            key="text"
                            name="text"
                            label="text"
                            formik={formikEdit.formik}
                            existed={false}>
                        </TextArea>
                        {/* {isEditing && successMessageVisible && <Alert color="green">Review updated successfully!</Alert>} */}
                        {<Alert {...formikEdit.alertProps} />}
                        {/* {submitError && <Alert color="red">{submitError}</Alert>} */}
                        {/* <Button loading={formikCreate.isSubmitting} existed={false}>Submit</Button> */}
                        <Button {...formikEdit.buttonProps} existed={false}>Submit</Button>
                    </FormItems>
                </form>}
            </div>}
            {!isEditing && <div>
                {me?.id && props.bookResult && <form onSubmit={(e) => {
                    e.preventDefault();
                    formikCreate.formik.handleSubmit();
                    }}>
                    <FormItems>
                        <Input
                            key="title"
                            name="title"
                            label="Title"
                            formik={formikCreate.formik}
                            existed={reviewCurrUserExists || formikCreate.formik.isSubmitting}
                        />
                        <Input
                            key="score"
                            name="score"
                            label="Score"
                            formik={formikCreate.formik}
                            existed={reviewCurrUserExists || formikCreate.formik.isSubmitting}
                        >
                        </Input>
                        <TextArea
                            key="text"
                            name="text"
                            label="text"
                            formik={formikCreate.formik}
                            existed={reviewCurrUserExists || formikCreate.formik.isSubmitting}>
                        </TextArea>
                        {/* {!isEditing && successMessageVisible && <Alert color="green">Review submitted successfully!</Alert>} */}
                        {/* {!isEditing && successMessageVisible && <Alert {...alertProps}>Review submitted successfully!</Alert>} */}
                        {!isEditing && <Alert {...formikCreate.alertProps}>Review submitted successfully!</Alert>}
                        {/* {submitError && <Alert color="red">{submitError}</Alert>} */}
                        {/* <Button loading={formikCreate.isSubmitting} existed={reviewCurrUserExists}>Submit</Button> */}
                        <Button {...formikCreate.buttonProps} existed={reviewCurrUserExists || formikCreate.formik.isSubmitting}>Submit</Button>
                    </FormItems>
                </form>}
            </div>}
            <div className={css.reviews}>
                <Segment title={reviews.length > 0 ? "Reviews" : ""} size={2}>{AllReviews}</Segment>
            </div>
        </div>
    )
}