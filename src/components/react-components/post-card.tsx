import { Article } from "phosphor-react";
import type { MDInstance } from "../../helpers/types";
import Skeleton from "./skeleton";

interface PostProps {
  post?: MDInstance;
  showPreview: boolean;
}

export default function Post({ post, showPreview }: PostProps) {
  return (
    <li>
      <a className={"react-card"} href={post?.url}>
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
            {post?.frontmatter.title || <Skeleton />}
          </h2>
        </div>
        <h4 className="react-article-date">
          {post?.frontmatter.date || <Skeleton />}
        </h4>
        {showPreview && (
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
      </a>
    </li>
  );
}
