'use client';

import React from 'react';
import styles from "./LoginForm.module.css";
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userInfo/store';
import Cookies from 'js-cookie';
import makeApiCall from '@/lib/helpers/apiHandlers/api';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputComponent from '@/components/InputComponent/InputComponent';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((state: any) => state.setUser);

  const formik = useFormik({
    initialValues: {
      Username: '',
      password: '',
    },

    validationSchema: Yup.object({
      Username: Yup.string().required('This field is required'),
      password: Yup.string().required('This field is required'),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res: any = await makeApiCall.post('/auth/login', {
          Username: values.Username,
          password: values.password,
        });

        const token =
          res?.data?.token ||
          res?.data?.data?.token ||
          res?.data?.accessToken;

        const userData =
          res?.data?.user ||
          res?.data?.data?.user || {
            name: values.Username,
            email: `${values.Username}@mail.com`,
          };

        if (token) {
          Cookies.set('token', token, { expires: 1 });
        }
        Cookies.set('token', token, { expires: 1 });

        setUser(JSON.stringify(userData));

        router.push('/dashboard');

      } catch (error: any) {
        // alert(
        //   error?.response?.data?.message ||
        //   'Invalid Username / Password'
        // );
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.logo}>MB</div>

        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>
          Sign in to MB2ERP Middleware
        </p>

        <form onSubmit={formik.handleSubmit}>

          {/* USERNAME */}
          <div className={styles.field}>

            <InputComponent
              type="text"
              name="Username"
              label="Username"

              placeholder="Enter username"
              value={formik.values.Username}
              onChangeEvent={formik.handleChange}
              onBlur={formik.handleBlur}
              isrequired={true}
            />

            {formik.touched.Username &&
              formik.errors.Username && (
                <div
                  style={{
                    color: 'red',
                    fontSize: 12,
                    marginTop: 5
                  }}
                >
                  {formik.errors.Username}
                </div>
              )}
          </div>

          {/* PASSWORD */}
          <div className={styles.field}>
            <div className={styles.passwordHeader}>

            </div>

            <InputComponent
              type="password"
              name="password"
              label="Password"
              value={formik.values.password}
              onChangeEvent={formik.handleChange}
              onBlur={formik.handleBlur}
              isrequired={true}
            />
            <span className={styles.forgot}>
              Forgot password?
            </span>

            {formik.touched.password &&
              formik.errors.password && (
                <div
                  style={{
                    color: 'red',
                    fontSize: 12,
                    marginTop: 5
                  }}
                >
                  {formik.errors.password}
                </div>
              )}
          </div>

          {/* BUTTON */}
          <ButtonComponent
            htmlType="submit"
            style={{
              width: '100%',
              height: 45,
              marginTop: 15,
              background: '#020617',
              color: '#fff',
              borderRadius: 10
            }}
          >
            {formik.isSubmitting
              ? 'Signing in...'
              : 'Sign in'}
          </ButtonComponent>

        </form>

        <div className={styles.footer}>
          Don&apos;t have an account? <span>Create account</span>
        </div>

      </div>
    </div>
  );
}

// 'use client';

// import React from 'react';
// import styles from "./LoginForm.module.css"
// import ButtonComponent from '@/components/ButtonComponent/ButtonComponent';
// import { useRouter } from 'next/navigation';
// import { useUserStore } from '@/store/userInfo/store';
// import Cookies from 'js-cookie';

// export default function LoginPage() {
//   const router = useRouter();


//   const setUser = useUserStore((state: any) => state.setUser);

//   const handleLogin = () => {
//     const userData = {
//       name: "Admin",
//       email: "admin@corelife.com"
//     };

//     setUser(JSON.stringify(userData));

//     Cookies.set("token", "dummy-token"); // ✅ ADD THIS

//     router.push('/dashboard');
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>

//         <div className={styles.logo}>MB</div>

//         <h2 className={styles.title}>Welcome back</h2>
//         <p className={styles.subtitle}>Sign in to MB2ERP Middleware</p>

//         {/* EMAIL */}
//         <div className={styles.field}>
//           <label>Email</label>
//           <input type="email" placeholder="name@corelife.com" />
//         </div>

//         {/* PASSWORD */}
//         <div className={styles.field}>
//           <div className={styles.passwordHeader}>
//             <label>Password</label>
//             <span className={styles.forgot}>Forgot password?</span>
//           </div>
//           <input type="password" />
//         </div>

//         {/* DEMO
//         <div className={styles.demoBox}>
//           <div className={styles.demoTitle}>Demo Credentials:</div>
//           <div>Email: admin@corelife.com</div>
//           <div>Password: admin123</div>
//         </div> */}

//         {/* BUTTON */}
//         <ButtonComponent
//           onClickEvent={handleLogin}
//           style={{
//             width: '100%',
//             height: 45,
//             marginTop: 15,
//             background: '#020617',
//             color: '#fff',
//             borderRadius: 10
//           }}
//         >
//           Sign in
//         </ButtonComponent>

//         <div className={styles.footer}>
//           Don't have an account? <span>Create account</span>
//         </div>

//       </div>
//     </div>
//   );
// }
