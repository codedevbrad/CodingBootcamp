import { HomeworkPanel } from "./studentPanel";

export default async function StudentHomePage({ params }: { params: { slug: string } }) {
  const studentProfileId = params.slug;

  return (
    <div>
        <HomeworkPanel studentId={ studentProfileId } />
    </div>
  )
}
