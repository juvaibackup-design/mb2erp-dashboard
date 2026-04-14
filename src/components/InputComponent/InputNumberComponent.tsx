// import {
//   autoRoundOff,
//   getUserDetails,
//   restrictDecimal,
// } from "@/lib/helpers/utilityHelpers";
// import { Flex, InputNumber, InputNumberProps } from "antd";
// import React from "react";

// type ExtendedInputNumberProps = InputNumberProps & {
//   name?: string | undefined;
//   label?: string | undefined;
//   errormsg?: any | undefined;
//   isrequired?: boolean | undefined;
//   formik?: any;
// };

// export default function InputNumberComponent(props: ExtendedInputNumberProps) {
//   const { formik, name, onChange } = props;
//   // const { decimals = 2 } = getUserDetails();
//   return (
//     <Flex vertical gap={8}>
//       {props.label && (
//         <p className="label">
//           <span className="error">{props.isrequired ? "* " : null}</span>
//           {props.label}
//         </p>
//       )}
//       <InputNumber
//         {...props}
//         // precision={decimals}
//         value={props.value}
//         name={props.name}
//         type={props.type ? props.type : "number"}
//         rootClassName={props.errormsg ? "errBorder" : ""}
//       />
//       {props.errormsg && <p className="error">{props.errormsg}</p>}
//     </Flex>
//   );
// }


import {
  autoRoundOff,
  getUserDetails,
  restrictDecimal,
} from "@/lib/helpers/utilityHelpers";
import { Flex, InputNumber, InputNumberProps } from "antd";
import React, { forwardRef } from "react";

type ExtendedInputNumberProps = InputNumberProps & {
  name?: string | undefined;
  label?: string | undefined;
  errormsg?: any | undefined;
  isrequired?: boolean | undefined;
  formik?: any;
};

const InputNumberComponent = forwardRef<any, ExtendedInputNumberProps>(
  (props, ref) => {
    return (
      <Flex vertical gap={8}>
        {props.label && (
          <p className="label">
            <span className="error">{props.isrequired ? "* " : null}</span>
            {props.label}
          </p>
        )}

        <InputNumber
          {...props}
          ref={ref}   // ✅ THIS IS THE KEY
          value={props.value}
          name={props.name}
          type={props.type ? props.type : "number"}
          rootClassName={props.errormsg ? "errBorder" : ""}
        />

        {props.errormsg && <p className="error">{props.errormsg}</p>}
      </Flex>
    );
  }
);

export default InputNumberComponent;