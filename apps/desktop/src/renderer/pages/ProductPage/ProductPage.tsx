import { useSiteParser } from "../../features/parser/model/parser.context.tsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { getMobileDePageData } from "../../features/parser/lib/parser.utils.ts";
import { MobileDeRuPostItemType } from "../../features/parser/model/parser.types.ts";
import { AppButton } from "../../shared/ui/AppButton/AppButton.tsx";

export function sanitizeHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("script").forEach((el) => el.remove());

    return doc.body.innerHTML;
}

export function ProductPage() {
    const { state } = useSiteParser();
    const hiddenRef = useRef<HTMLDivElement>(null);
    const [parsedSite, setParsedSite] = useState<MobileDeRuPostItemType | null>(null);

    const sentToTelegram = async () => {

    }

    const sanitizedHtml = useMemo(() => {
        if (!state.html) return "";
        return sanitizeHtml(state.html);
    }, [state.html]);

    useEffect(() => {
        if (!hiddenRef.current) return;
        if (!sanitizedHtml) return;

        const result = getMobileDePageData('http://test.com');

        setParsedSite(result);

    }, [sanitizedHtml]);

    useEffect(() => {
        if (!parsedSite) return;
        console.log('parsedSite: ', parsedSite);
    }, [parsedSite]);

    return (
        <div>
            <div
                ref={hiddenRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                    opacity: 0,
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </div>

            <AppButton onClick={sentToTelegram}>
                Кнопка
            </AppButton>
        </div>
    );
}