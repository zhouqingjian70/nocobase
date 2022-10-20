import { useForm } from '@formily/react';
import { RouteSwitchContext, SignupPage, useSignup } from '@nocobase/client';
import React, { useContext } from 'react';

const useCustomSignup = () => {
  const { run } = useSignup({
    message: {
      success: '自定义提示'
    },
  });
  const form = useForm();
  return {
    async run() {
      console.log('useCustomSignup');
      form.setValuesIn('url', 'bb');
      await run();
    },
  };
};

const CustomSignupPage: React.FC = (props) => {
  return (
    <div>
      <div>Custom sign up page</div>
      <SignupPage {...props} scope={{ useSignup: useCustomSignup }} />
    </div>
  );
};

export const CustomSignupPageProvider = React.memo((props) => {
  const ctx = useContext(RouteSwitchContext);
  return (
    <RouteSwitchContext.Provider value={{ ...ctx, components: { ...ctx.components, SignupPage: CustomSignupPage } }}>
      {props.children}
    </RouteSwitchContext.Provider>
  );
});

export default CustomSignupPageProvider;
