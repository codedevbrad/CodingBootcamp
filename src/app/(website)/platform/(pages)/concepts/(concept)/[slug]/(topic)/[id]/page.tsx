
import CartoonCard from "@/components/custom/cartoonCard";
import TopicContent from "./content"
import BackLink from "@/components/custom/backTo"

export default async function TopicPage({
  params,
}: {
  params: { id: string , slug: string };
}) {
    const topicslug = params.id;
    const slug = params.slug
    return (
        <div className=" "> 
            <BackLink
              href={`/platform/concepts/${slug}`}
              text={`back to ${ slug }`}
            />
            <div className="flex flex-row">
              <TopicContent topicSlug={ topicslug } />
              <div className="sticky ">
                  <CartoonCard title="Table of Contents" label="content" >
                      <div>
                          <ul className="list-disc list-inside">
                              <li>Introduction</li>
                              <li>Getting Started</li>
                              <li>Core Concepts</li>
                              <li>Advanced Topics</li>
                              <li>Best Practices</li>
                              <li>Conclusion</li>
                          </ul>
                      </div>
                  </CartoonCard>

                  <CartoonCard title="Where next?" label="next steps" >
                      <div>
                          <ul className="list-inside">
                              <li>Related Topic 1</li>
                              <li>Related Topic 2</li>
                              <li>Related Topic 3</li>
                              <li>Related Topic 4</li>
                              <li>Related Topic 5</li>
                          </ul>
                      </div>
                  </CartoonCard>
              </div>
            </div>
        </div>
    )
}