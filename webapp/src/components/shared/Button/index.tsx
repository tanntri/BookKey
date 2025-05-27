
import css from './index.module.scss';
import cn from 'classnames';
import { Link } from 'react-router-dom';

type ButtonColor = 'red' | 'green' | 'blue'
export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
  type?: 'button' | 'submit'
  disabled?: boolean,
  existed?: boolean
  onClick?: () => void
}

export const Button = ({children, loading = false, existed = false, type = "submit", disabled, color = 'green', onClick}: ButtonProps) => {
    return (
        <button className={cn({
                [css.button]: true,
                [css.disabled]: loading || existed || disabled,
                [css.loading]: loading,
                [css[`color-${color}`]]: true
            })} 
                type={type} 
                disabled={loading || disabled || existed}
                onClick={onClick}
            >
            <span className={css.text}>{children}</span>
        </button>
    )
}

export const LinkToButton = ({children, to}: {children: React.ReactNode, to: string}) => {
    return (
        <Link className={cn({[css.button]: true})} to={to}>
            {children}
        </Link>
    )
}

export const ActionButton = ({children, action}: {children: string, action: any}) => {
    return (
        <input className={cn({
            [css.button]: true})}
            value={children}
            onClick={action}
            type="button"  />
    )
}

export const Buttons = ({ children }: { children: React.ReactNode }) => {
    return <div className={css.buttons}>{children}</div>
}