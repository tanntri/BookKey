import css from './index.module.scss';
import { Icon } from '../Icons';

export const Segment = ({
    title,
    size = 1,
    score = undefined,
    description,
    children
}: {
    title: React.ReactNode
    size?: 1 | 2
    score?: number
    description?: string
    children?: React.ReactNode
}) => {
    return (
        <div className={css.segment}>
            {size === 1 ? <h1 className={css.title}>{title}</h1> : <h2 className={css.title}>{title}</h2>}
            {typeof score === 'number' ? <div className={css.stars}>
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        className={css.starIcon}
                        style={{ color: i < score ? 'var(--yellow)' : '#ccc' }}
                        size={20}                                            />
                    ))}
                </div> : <></>}
            {description && <p className={css.description}>{description}</p>}
            {children && <div className={css.content}>{children}</div>}
        </div>
    )
}