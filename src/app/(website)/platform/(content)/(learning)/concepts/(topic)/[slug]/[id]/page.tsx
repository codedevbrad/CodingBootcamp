
import TopicContent from "./topicContent"
import {BackLink} from "@/components/custom/backTo"

type Params = { params: { id: string , slug: string } };

export default async function TopicPage({ params } : Params ) {
    const topicslug = params.id;
    const slug = params.slug
    return (
        <div className="w-full"> 
            <BackLink
              href={`/platform/concepts/${slug}`}
              text={`back to ${ slug }`}
            />
            <TopicContent topicSlug={ topicslug } />
        </div>
    )
}