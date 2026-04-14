import React from "react";
import { Input, Flex } from "antd";
import type { TextAreaProps } from "rc-textarea/lib/interface";
interface Props extends Omit<TextAreaProps, "size"> {
  label?: string;
  required?: boolean;

  errormsg?: any;
}
export default function TextAreaComponent({
  label,
  required,
  errormsg,
  style,
  ...restProps
}: Props) {
  const { TextArea } = Input;
  const errorStyle = errormsg && { border: "1px solid red" };
  console.log({ ...errorStyle, ...style });
  return (
    <Flex vertical gap={8}>
      {label && (
        <p className="label">
          <span className="error">{required ? "* " : null}</span>
          {label}
        </p>
      )}
      <TextArea style={{ ...errorStyle, ...style }} {...restProps} />
      {errormsg && <div style={{ color: "red" }}>{errormsg}</div>}
    </Flex>
  );
}
// import React from "react";
// import { Input } from "antd";
// import type { TextAreaProps } from "rc-textarea/lib/interface";

// interface Props extends TextAreaProps {
//   errormsg?: string; // Make it optional if necessary
// }

// export const TextAreaComponent: React.FC<Props> = ({
//   errormsg,
//   ...restProps
// }) => {
//   const { TextArea } = Input;

//   return (
//     <div>
//       {/* TextArea with all props passed */}
//       <TextArea {...restProps} />

//       {/* Conditionally render the error message */}
//       {errormsg && <div style={{ color: "red" }}>{errormsg}</div>}
//     </div>
//   );
// };
