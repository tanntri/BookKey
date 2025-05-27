import { FormikProps } from "formik"
import cn from 'classnames';
import css from './index.module.scss'

export const TextArea = ({name,label, formik, existed = false}: {
    name: string;
    label: string;
    formik: FormikProps<any>; 
    existed?: boolean
}) => {
    const value = formik.values[name];
    const error = formik.errors[name] as string | undefined;
    const touched = formik.touched[name];
    const disabled = formik.isSubmitting || existed;
    const invalid = !!error && !!touched 
    return (
        <div className={cn({[css.field]: true, [css.disabled]: disabled})}>
            <label className={css.label} htmlFor={name}>{label}</label>
            <textarea className={cn({[css.input]: true, [css.invalid]: invalid})} name={name} id={name} value={value} onChange={(e) => {
                void formik.setFieldValue(name, e.target.value)
            }} onBlur={() => {
                void formik.setFieldTouched(name);
            }} disabled={disabled}></textarea>
            {invalid && <div style={{color: 'red'}}>{error}</div>}
        </div>
    )
}