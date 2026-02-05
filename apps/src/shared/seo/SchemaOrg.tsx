type SchemaOrgProps = {
  schema: Record<string, any>;
  id?: string;
};

export default function SchemaOrg({
  schema,
  id = "schema-org",
}: SchemaOrgProps) {
  if (!schema) return null;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
