import { Article } from "phosphor-react";
import type { MDInstance } from "../../helpers/types";
import Skeleton from "./skeleton";

interface PostProps {
  post?: MDInstance;
  showPreview: boolean;
  comingSoon?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Post({
  post,
  showPreview,
  comingSoon = false,
  title,
  subtitle,
}: PostProps) {
  const content = (
    <>
      <div className={"react-flex row alignFlexStart"}>
        <Article
          size={32}
          weight="bold"
          color="var(--color-card-text)"
          style={{
            marginRight: "1em",
            marginTop: "0.15em",
            flexShrink: 0,
          }}
        />
        <h2 className="fancy-text react-article-title">
          {title || post?.frontmatter.title || <Skeleton />}
        </h2>
      </div>
      {subtitle && <p className="react-article-subtitle">{subtitle}</p>}
      <h4 className="react-article-date">
        {comingSoon ? "Coming soon!" : post?.frontmatter.date || <Skeleton />}
      </h4>
      {!comingSoon && showPreview && (
        <div className="react-preview">
          <div className="react-preview-label">
            <h3>PREVIEW</h3>
          </div>
          <div
            className="react-preview-content md"
            dangerouslySetInnerHTML={{
              __html: post?.compiledContent() || "",
            }}
          ></div>
        </div>
      )}
    </>
  );

  return (
    <li>
      {comingSoon ? (
        <div className={"react-card coming-soon"}>{content}</div>
      ) : (
        <a className={"react-card"} href={post?.url}>
          {content}
        </a>
      )}
    </li>
  );
}
