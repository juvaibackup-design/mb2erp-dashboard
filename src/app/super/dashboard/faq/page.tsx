import { fetchAPI } from "@/lib/middleware/server/apiMiddleware";
import FAQPage from "./FAQPage";

export default async function Page() {
  const allForms = await fetchAPI(
    `GetFaqForms`,
    "GET",
    null,
    ["faq"]
  );
  const allRelease = await fetchAPI(
    `GetReleaseNote`,
    "GET",
    null,
    ["release"]
  )
  // const commentData = await fetchAPI("GetReleaseNote").then(
  //   (response) => response?.data?.allCommentsDetails
  // )
  return <FAQPage allForms={allForms.data.faqFormsDetails} allRelease={allRelease?.data?.releaseNoteDetails} />;
}
