import type { SchemaTypeDefinition } from "sanity";
export const schemaTypes = [
  {
    name: "rmPage",
    title: "Website pages, articles & workflows",
    type: "document",
    fields: [
      {
        name: "path",
        title: "Full path, e.g. /insights/your-guide",
        type: "string",
        validation: (Rule) =>
          Rule.required().regex(/^\/[a-z0-9]+(?:[a-z0-9/-]*[a-z0-9])?$/, {
            name: "lowercase site path",
          }),
      },
      {
        name: "title",
        title: "Short navigation title",
        type: "string",
        validation: (Rule) => Rule.required().min(5).max(100),
      },
      {
        name: "seoTitle",
        title: "Search title (optional; defaults to navigation title)",
        type: "string",
      },
      {
        name: "heading",
        title: "Page heading (H1)",
        type: "string",
        validation: (Rule) => Rule.required().min(5).max(150),
      },
      {
        name: "description",
        type: "text",
        validation: (Rule) => Rule.required().min(20).max(320),
      },
      {
        name: "kind",
        type: "string",
        options: {
          list: [
            "about",
            "article",
            "articles",
            "audience",
            "audience-index",
            "campaign",
            "capability",
            "capability-index",
            "case",
            "cases",
            "checklists",
            "comparison",
            "diagnostic",
            "download",
            "editorial",
            "form",
            "guides",
            "implementation",
            "legal",
            "owner-view",
            "platform",
            "pricing",
            "process",
            "resources",
            "rhythm",
            "search",
            "security",
            "thanks",
            "workstreams",
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "published",
        type: "boolean",
        initialValue: true,
        validation: (Rule) => Rule.required(),
      },
      {
        name: "indexable",
        type: "boolean",
        initialValue: true,
        validation: (Rule) => Rule.required(),
      },
      {
        name: "publishedAt",
        title: "Original publication date",
        type: "date",
        validation: (Rule) =>
          Rule.custom((value, context) =>
            context.document?.kind === "article" && !value
              ? "Articles need an original publication date."
              : true,
          ),
      },
      {
        name: "updated",
        type: "date",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "status",
        title: "Approved service or proof status",
        type: "string",
      },
      {
        name: "category",
        title: "category",
        type: "string",
      },
      {
        name: "icon",
        title: "Supplied icon name only",
        type: "string",
        options: { list: ["book", "calendar", "chat", "clock", "cost", "tips"] },
      },
      {
        name: "takeaway",
        title: "takeaway",
        type: "string",
        validation: (Rule) =>
          Rule.custom((value, context) =>
            context.document?.kind === "article" && !value
              ? "Articles need a concise takeaway."
              : true,
          ),
      },
      {
        name: "author",
        title: "author",
        type: "string",
        validation: (Rule) =>
          Rule.custom((value, context) =>
            context.document?.kind === "article" && !value
              ? "Articles need an approved byline."
              : true,
          ),
      },
      {
        name: "keyword",
        title: "keyword",
        type: "string",
      },
      {
        name: "related",
        type: "array",
        validation: (Rule) => Rule.unique(),
        of: [
          {
            type: "string",
          },
        ],
      },
      {
        name: "sections",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "title",
                title: "title",
                type: "string",
              },
              {
                name: "body",
                type: "text",
              },
              {
                name: "items",
                type: "array",
                of: [
                  {
                    type: "string",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    preview: {
      select: {
        title: "title",
        subtitle: "path",
      },
    },
  },
  {
    name: "rmTier",
    title: "Enquiry-only service levels",
    type: "document",
    fields: [
      {
        name: "name",
        title: "name",
        type: "string",
      },
      {
        name: "order",
        type: "number",
      },
      {
        name: "description",
        title: "description",
        type: "string",
      },
      {
        name: "fit",
        type: "text",
      },
      {
        name: "features",
        type: "array",
        of: [
          {
            type: "string",
          },
        ],
      },
      {
        name: "note",
        type: "text",
        initialValue:
          "Final scope and pricing are confirmed after a Restaurant Operations Review.",
      },
    ],
  },
  {
    name: "rmFaq",
    title: "Frequently asked questions",
    type: "document",
    fields: [
      {
        name: "order",
        type: "number",
      },
      {
        name: "question",
        title: "question",
        type: "string",
      },
      {
        name: "answer",
        type: "text",
      },
    ],
    preview: {
      select: {
        title: "question",
      },
    },
  },
  {
    name: "rmSettings",
    title: "Brand, navigation & review offer",
    type: "document",
    fields: [
      {
        name: "brand",
        title: "brand",
        type: "string",
      },
      {
        name: "email",
        title: "email",
        type: "string",
      },
      {
        name: "cta",
        title: "cta",
        type: "string",
      },
      {
        name: "hero",
        type: "text",
      },
      {
        name: "heroSupport",
        type: "text",
      },
      {
        name: "reviewOffer",
        type: "text",
      },
      {
        name: "workingDay",
        title: "Working day scenes",
        type: "array",
        of: [{
          type: "object",
          fields: [
            { name: "phase", type: "string" },
            { name: "heading", type: "string" },
            { name: "record", type: "string" },
            { name: "question", type: "string" },
            { name: "action", type: "text" },
            { name: "handoff", type: "string" },
            { name: "href", title: "Service page path", type: "string" },
            { name: "link", title: "Link label", type: "string" },
          ],
        }],
      },
      {
        name: "navigation",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "label",
                title: "label",
                type: "string",
              },
              {
                name: "href",
                title: "href",
                type: "string",
              },
            ],
          },
        ],
      },
      {
        name: "socials",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "label",
                title: "label",
                type: "string",
              },
              {
                name: "url",
                type: "url",
              },
            ],
          },
        ],
      },
      {
        name: "credit",
        type: "object",
        fields: [
          {
            name: "label",
            title: "label",
            type: "string",
          },
          {
            name: "url",
            type: "url",
          },
        ],
      },
      {
        name: "proofOrder",
        type: "array",
        of: [
          {
            type: "string",
          },
        ],
      },
      {
        name: "formFields",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "name",
                title: "Existing field key",
                type: "string",
              },
              {
                name: "label",
                title: "label",
                type: "string",
              },
              {
                name: "required",
                type: "boolean",
              },
            ],
          },
        ],
      },
      {
        name: "experiments",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              {
                name: "id",
                title: "id",
                type: "string",
              },
              {
                name: "hypothesis",
                title: "hypothesis",
                type: "string",
              },
              {
                name: "audience",
                title: "audience",
                type: "string",
              },
              {
                name: "startDate",
                type: "date",
              },
              {
                name: "endDate",
                type: "date",
              },
              {
                name: "decision",
                title: "decision",
                type: "string",
              },
              {
                name: "enabled",
                type: "boolean",
                initialValue: false,
              },
            ],
          },
        ],
      },
    ],
  },
] satisfies SchemaTypeDefinition[];
