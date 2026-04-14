import { showAlert } from "./alert";
export const handleApiError = (
  error: any,
  defaultMessage: string = "An unexpected error occurred."
) => {
  const data = error?.response?.data || {};
  let validationError: string | undefined;
  if (data?.errors && typeof data.errors === "object") {
    const errors = data.errors as Record<string, any>;
    if (
      Array.isArray(errors.searchiteminfo) &&
      errors.searchiteminfo.length > 0
    ) {
      validationError = errors.searchiteminfo[0];
    } else {
      const firstKey = Object.keys(errors)[0];
      const firstVal = errors[firstKey];
      if (Array.isArray(firstVal) && firstVal.length > 0) {
        validationError = firstVal[0];
      } else if (typeof firstVal === "string") {
        validationError = firstVal;
      }
    }
  }
  const apiError =
    validationError ||
    data?.errorDescription ||
    data?.errordescription ||
    data?.message ||
    data?.error ||
    error?.message ||
    defaultMessage;
  showAlert(apiError);
  console.error("API Error:", error);
};
