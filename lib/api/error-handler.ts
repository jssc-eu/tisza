import sendMail from 'lib/api/send-mail';
import createErrorMessage from 'lib/api/create-error-email';

const errorHandler = async (message, error, request = null) => {
  console.log(error);

  if (process.env.NODE_ENV !== 'production') return;

  await sendMail(
    message,
    request ? createErrorMessage(request.body, error) : error
  );
};

export default errorHandler;
