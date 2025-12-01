import BlocksManagerClient from "./client.blocks"
import BlockExplainedPage from "./explained"

export default async function BlockAdminPage() {
    return <div className="w-full">
        <BlockExplainedPage />
        <BlocksManagerClient />
    </div>;
}
