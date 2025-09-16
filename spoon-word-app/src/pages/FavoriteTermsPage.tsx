import React from "react";
import styled from "styled-components";
import { deleteFavoriteTerm } from "../api/favorites";
// import toast from "react-hot-toast";

type FavoriteItem = {
    favoriteTermId: string;  // 서버 DELETE에 필요한 id
    termId: string;
    title: string;
    description: string;
    tags?: string[];
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
`;

const Card = styled.article`
  position: relative;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
`;

const DeleteBtn = styled.button<{ disabled?: boolean }>`
  position: absolute;
  top: 12px; right: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  height: 28px; padding: 0 10px;
  background: #fff; cursor: pointer;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

const Empty = styled.div`
  border: 1px dashed #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: #6b7280;
`;

export default function FavoriteTermsPage() {
    const [items, setItems] = React.useState<FavoriteItem[]>([]);
    const [busy, setBusy] = React.useState<Record<string, boolean>>({});

    // TODO: 초기 로딩(fetch) 로직은 기존대로…

    const handleDelete = async (favoriteTermId: string) => {
        if (busy[favoriteTermId]) return;

        // 낙관적 제거
        const prev = items;
        const next = prev.filter(it => it.favoriteTermId !== favoriteTermId);
        setItems(next);
        setBusy(b => ({ ...b, [favoriteTermId]: true }));

        try {
            await deleteFavoriteTerm(favoriteTermId);
            // toast.success("즐겨찾기에서 삭제했어요.");
        } catch (e: any) {
            // 롤백
            setItems(prev);
            const s = e?.response?.status;
            if (s === 401) {
                // toast.error("로그인이 필요합니다.");
                alert("로그인이 필요합니다.");
            } else if (s === 404) {
                // 이미 지워졌거나 없는 경우: 사용자 입장에선 성공과 동일하게 처리해도 무방
                // toast("이미 삭제된 항목이에요.", { icon: "ℹ️" });
            } else {
                // toast.error("삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
                alert("삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
            }
        } finally {
            setBusy(b => ({ ...b, [favoriteTermId]: false }));
        }
    };

    if (items.length === 0) return <Empty>즐겨찾기한 용어가 없어요.</Empty>;

    return (
        <Grid>
            {items.map(it => (
                <Card key={it.favoriteTermId} aria-labelledby={`fav-${it.favoriteTermId}`}>
                    <h3 id={`fav-${it.favoriteTermId}`}>{it.title}</h3>
                    <p>{it.description}</p>

                    <DeleteBtn
                        onClick={() => handleDelete(it.favoriteTermId)}
                        disabled={busy[it.favoriteTermId]}
                        aria-busy={busy[it.favoriteTermId]}
                        aria-label="즐겨찾기에서 삭제"
                        title="즐겨찾기에서 삭제"
                    >
                        삭제
                    </DeleteBtn>
                </Card>
            ))}
        </Grid>
    );
}
