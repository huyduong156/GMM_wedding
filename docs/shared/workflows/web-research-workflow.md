# Quy trình web research

## Mục tiêu

Các tác vụ cần Google/web search được giao cho một sub-agent chuyên nghiên cứu để kết quả thô, nội dung trang dài và các nhánh tìm kiếm không làm đầy context của agent chính.

## Cách dùng

- Skill nguồn: `.agents/skills/web-research-agent/SKILL.md`.
- Kích hoạt khi cần thông tin mới, tài liệu bên ngoài, xác minh nguồn, tìm ảnh/tài sản hoặc kiểm tra giấy phép.
- Không kích hoạt khi câu trả lời đã có trong repository; `docs/` vẫn là nguồn ưu tiên cho quyết định sản phẩm và kỹ thuật.
- Agent chính định nghĩa câu hỏi hẹp. Sub-agent tìm và kiểm chứng, sau đó chỉ trả recommendation, evidence, risk và implementation notes.
- Kết luận dùng trong câu trả lời phải dẫn link trực tiếp tới nguồn hỗ trợ. Ảnh tải về phải ghi nguồn, tác giả và giấy phép trước khi commit.

Đây là một agent orchestration workflow, không phải model được train hoặc fine-tune riêng. Model override chỉ được dùng khi người dùng yêu cầu rõ.
