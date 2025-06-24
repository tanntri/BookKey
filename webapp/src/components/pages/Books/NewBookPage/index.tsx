import { Segment } from '../../../shared/Segment/segment';
import { Input } from '../../../shared/Input/Input';
import { TextArea } from '../../../shared/TextArea/TextArea';
import { useFormik } from 'formik';
import { withZodSchema } from 'formik-validator-zod';
import { trpc } from '../../../../lib/trpc';
import { zCreateBookTrpcInput } from '@bookkey/backend/src/router/books/createBook/input';
import { useEffect, useState } from 'react';
import { Alert } from '../../../shared/Alert/index';
import { Button } from '../../../shared/Button/index';
import { FormItems } from '../../../shared/FormItems';
import { withPageWrapper } from '../../../../lib/pageWrapper'
// import { useParams } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async'
import { sentryCaptureException } from '../../../../lib/sentry';

export const NewBookPage = withPageWrapper({
    authorizedOnly: true,
    // useQuery: () => {
    //     const { isbn } = useParams() as viewBookRouteParams;
    //     return trpc.getBook.useQuery({
    //         isbn
    //     })
    // }
    // checkExists: ({ queryResult }) => !!queryResult.data.book
    // checkExistsMessage: 'Book Not Found'
    // checkAccess: ({ queryResult, ctx }) => !!ctx.me && ctx.me.id === queryResult.data.book.authorId,
    // checkAccess: ({ queryResult, ctx }) => !!ctx.me,
    // checkAccessMessage: 'Access denied',
    // setProps: ({ queryResult }) => {
    //     book: queryResult.data.book!
    // }
})
(() => {
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const createBook = trpc.createBook.useMutation();
    const formik = useFormik({
        initialValues: {
            book: '',
            author: '',
            isbn: '',
            reviewer: '',
            description: '',
            review: ''
        },
        validate: withZodSchema(
            zCreateBookTrpcInput
        ),
        onSubmit: async (values) => {
            try {
                await createBook.mutateAsync(values);
                // if no problem occur, it will proceed
                formik.resetForm()
                setSuccessMessageVisible(true);
                setTimeout(() => {
                    setSuccessMessageVisible(false)
                }, 3000)
            } catch(e: any) {
                sentryCaptureException(e);
                console.log(e)
                setSubmitError(e.message)
            }
        }
    })

    useEffect(() => {
        document.title = 'Create Book -- BookKey';
    }, [])

    return (
        <Segment title="New Book">
            {/* for some reason helmet doesn't work */}
            {/* <Helmet>
                <title>New Book - BookKey</title>
            </Helmet> */}
            <form onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
            }}>
                <FormItems>
                    <Input
                        key="book"
                        name="book"
                        label="Book"
                        formik={formik}
                        maxWidth={500} 
                    />
                    <Input
                        key="isbn"
                        name="isbn"
                        label="ISBN"
                        formik={formik}
                    />
                    <Input
                        key="author"
                        name="author"
                        label="Author"
                        formik={formik}  
                    />
                    <br />
                    <TextArea
                        key="description"
                        name="description"
                        label="Description"
                        formik={formik}
                    />
                    <br />
                    {/* {successMessageVisible && <div style={{color: 'green'}}>Review submitted successfully!</div>} */}
                    {successMessageVisible && <Alert color="green">Review submitted successfully!</Alert>}
                    {/* {submitError && <div style={{color: 'red'}}>{submitError}</div>} */}
                    {submitError && <Alert color="red">{submitError}</Alert>}
                    {/* <button type='submit' disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Submitting...' : 'Submit'}</button> */}
                    <Button loading={formik.isSubmitting}>Submit</Button>
                </FormItems>
            </form>
        </Segment>
    )
})