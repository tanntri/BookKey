import css from './index.module.scss';

type CoverImageProps = {
    title: string;
    coverId?: string;
};

export const CoverImage = ({ title, coverId }: CoverImageProps) => {
    return (
      <div className={css.cover}>
        {coverId ? (
          <img src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`} alt={`${title} cover`} loading='lazy' />
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
};