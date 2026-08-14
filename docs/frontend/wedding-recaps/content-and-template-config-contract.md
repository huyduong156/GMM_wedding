# Wedding Recap content và template config contract

Recap tách semantic content khỏi presentation. Renderer chỉ đọc content/theme/config đã validate; không đọc fixture ngầm trong production.

## Content shape

The content model is organized around real wedding events and guest photo access. An event is not a decorative chapter: it must have a human-readable label and may be omitted when no approved media exists. The album destination is a first-class product surface, not an optional footer decoration.

```ts
type RecapContentV1 = {
  couple: { names: string; date?: string; place?: string };
  opening?: { eyebrow?: string; title: string; body?: string; media?: MediaRef };
  thanks: { title?: string; body: string; signature?: string; media?: MediaRef };
  events: Array<{
    key: string; label: string; title?: string; body?: string;
    media: MediaRef[]; mediaMode?: 'grid' | 'masonry' | 'carousel' | 'featured' | 'external-album';
    albumUrl?: string; captions?: Record<string, string>;
  }>;
  ceremony?: { title?: string; body?: string; media: MediaRef[]; mediaMode?: 'grid' | 'masonry' | 'carousel' | 'featured' };
  closing?: { title?: string; body: string; media?: MediaRef };
  album?: { title?: string; body?: string; items?: MediaRef[]; url?: string; ctaLabel?: string; cover?: MediaRef };
  share?: { title?: string; description?: string; image?: MediaRef };
};
```

`MediaRef` chỉ tham chiếu asset đã ready/được phép public; không nhúng URL tùy ý hoặc PII vào fixture. Lời chúc phải là bản approved được owner chọn. Template xử lý empty/missing media, title dài, không có gallery và chapter bị tắt.

## Template config

```ts
type WeddingRecapTemplateConfigV1 = {
  templateKey: string; displayName: string; productType: 'RECAP';
  templateVersion: string; templateConfigVersion: 1; contentSchemaVersion: 1; rendererApiVersion: 1;
  previewPath: string;
  capabilities: { seo: boolean; share: boolean; wishes: boolean; video: boolean; music: boolean };
  style: { lane: string; palette: string; motionLevel: 'QUIET' | 'EXPRESSIVE' | 'CINEMATIC' };
  sections: Array<{ sectionKey: string; required: boolean; canToggle: boolean; canReorder: boolean; layoutKey: string }>;
};
```

Config có section order mặc định hợp lệ, layout key có trong catalog, capabilities khớp implementation và integer contract versions. Breaking content/config tăng version và có migration deterministic; đổi CSS/art direction không âm thầm đổi schema.

## Runtime/editor rules

Renderer dùng shared mobile first-load auto-scroll, shared music controller (nếu recap có track), reduced-motion và section adjacency contract. Không tạo listener/audio controller riêng cho từng theme. Editor có thể bật/tắt/reorder section; renderer resolve transition theo hàng xóm thực tế và giữ anchor/navigation.
