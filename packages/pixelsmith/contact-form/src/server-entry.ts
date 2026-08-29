export {
  createContactHandler,
  recordFormSubmission,
  type ContactHandlerConfig,
  type ContactHandlerConfigResolver,
  type ContactHandlerRequestOptions,
  type FormSubmissionRecord,
} from "./server";

export {
  createSecureSubmissionLogHandler,
  createSecureSubmissionLogHandler as createSubmissionLogHandler,
} from "./submission-log";
