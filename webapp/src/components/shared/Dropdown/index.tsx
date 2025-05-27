import { useState, useRef, useEffect, isValidElement } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import css from './index.module.scss';

type DropdownProps = {
  optionsObject: Record<string, any[]>;
  text?: React.ReactNode;
  onSelect?: (option: string) => void;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DropdownButton: React.FC<DropdownProps> = ({ onSelect, optionsObject, text }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isImageElement =
    isValidElement(text) && text.type === 'img';

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={css.dropdown}>
      <div
        className={isImageElement ? css.imageToggle : css.toggle}
        onClick={() => setOpen(p => !p)}
      >
        {text}
        {!isImageElement && <FiChevronDown />}
      </div>

      {open && (
        <DropdownPanel
          onSelect={onSelect}
          optionsObject={optionsObject}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};


// export const DropdownPanel: React.FC<DropdownProps> = ({ onSelect, optionsObject, setOpen }) => {
//   return (
//     <div className={css.panel}>
//       {Object.entries(optionsObject).map(([header, items]) => (
//         <div key={header} className={css.group}>
//           <div className={css.header}>{header}</div>
//           <ul className={css.list}>
//             {items.map(sub => (
//               <li
//                 key={sub}
//                 className={css.item}
//                 onClick={() => {
//                   onSelect?.(sub);
//                   setOpen?.(false)
//                 }}
//               >
//                 {sub}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   )
// }

export const DropdownPanel: React.FC<DropdownProps> = ({ onSelect, optionsObject, setOpen }) => {
  console.log('options:', optionsObject)
  return (
    <div className={css.panel}>
      {Object.entries(optionsObject).map(([header, items]) => (
        <div key={header} className={css.group}>
          <div className={css.header}>{header}</div>
          <ul className={css.list}>
            {items.map((sub, index) => {
              const isString = typeof sub === 'string';
              return (
                <li
                  key={isString ? sub : index}
                  className={css.item}
                  onClick={() => {
                    if (isString) {
                      onSelect?.(sub);
                    }
                    setOpen?.(false);
                  }}
                >
                  {isString ? sub : sub}
                  {console.log(sub)}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
