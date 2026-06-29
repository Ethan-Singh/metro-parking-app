import { facilityLines } from "../config/lineConfig";
import { lineBadge } from "../../../css/tokens";

export function LineBadge({ slug }: { slug: string }) {
    const lines = facilityLines[slug as keyof typeof facilityLines] ?? [];

    if (!lines.length) return null;

    return (
        <div className={"line-badge-group"}>
            {lines.map((line) => {
                const config = lineBadge.map[line];

                if (!config) return null;

                return (
                    <div
                        key={line}
                        className="line-badge"
                        style={{
                            "--line-badge-color": config.color,
                            "--line-badge-size": `${lineBadge.size}px`,
                            "--line-badge-font-size": `${lineBadge.fontSize}px`,
                        } as React.CSSProperties}
                    >
                        {line}
                    </div>
                );
            })}
        </div>
    );
}