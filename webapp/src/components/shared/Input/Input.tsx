import { FormikProps } from "formik";
import css from './index.module.scss';
import cn from 'classnames';
import { FaSearch, FaStar } from "react-icons/fa"; // optional: install react-icons

export const Input = ({name,label, formik, maxWidth, type = 'text', existed = false, search = false}: {
    name: string;
    label?: string;
    formik: FormikProps<any>;
    maxWidth?: number | string;
    type?: string;
    existed?: boolean;
    search?: boolean;
}) => {
    const value = formik.values[name];
    const error = formik.errors[name] as string | undefined;
    const touched = formik.touched[name];
    const disabled = formik.isSubmitting || existed;
    const invalid = !!error && !!touched;

    const handleStarClick = (index: number) => {
        if (!disabled) {
            void formik.setFieldValue(name, index + 1);
        }
    };

    return (
        <div className={cn({[css.field]: true, [css.disabled]: disabled, [css.searchInput]: label === "Search"})}>
            <label className={css.label} htmlFor={name}>{label}</label>

            {name === 'score' ? (
                <div className={css.stars}>
                    {[...Array(5)].map((_, i) => (
                        <FaStar
                            key={i}
                            className={cn(css.star, {
                                [css.filled]: i < value,
                                [css.clickable]: !disabled,
                            })}
                            onClick={() => handleStarClick(i)}
                        />
                    ))}
                </div>
            ) : (
                <div className={css.inputWrap}>
                    {search && <FaSearch className={css.searchIcon} />}
                    <input
                        className={cn({[css.input]: true, [css.invalid]: invalid, [css.search]: search})}
                        type={type}
                        placeholder={search ? 'Search' : undefined}
                        onChange={(e) => void formik.setFieldValue(name, e.target.value)}
                        onBlur={() => void formik.setFieldTouched(name)}
                        value={value}
                        name={name}
                        id={name}
                        disabled={disabled}
                        style={{ maxWidth }}
                    />
                </div>
            )}

            {invalid && <div className={css.error}>{error}</div>}
        </div>
    );
};
