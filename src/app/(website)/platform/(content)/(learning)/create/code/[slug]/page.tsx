export default function CodePage({ params }: { params: { slug: string } }) {
    return (
        <div>
            <h1>Code Page - {params.slug}</h1>
        </div>
    );
}