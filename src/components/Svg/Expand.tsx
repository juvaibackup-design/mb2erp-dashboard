type Props = {
  onClick?: any;
  className?: any;
};

export const Expand = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      cursor={"pointer"}
      className={props?.className}
      onClick={props.onClick}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17.5 11.6667V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H11.6667M8.33333 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V8.33333M12.5 7.5L17.5 2.5M17.5 2.5H12.5M17.5 2.5V7.5M7.5 12.5L2.5 17.5M2.5 17.5H7.5M2.5 17.5L2.5 12.5"
        stroke="#6F797B"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
