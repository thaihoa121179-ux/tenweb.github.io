/* Dữ liệu chuẩn dùng chung client/server; không thêm thông tin lịch sử. */
import content from "../data/museum-content.json" with { type: "json" };
export const records = [...content.topics.map(t=>t.guide), ...content.artifacts.map(a=>a.guide)];
