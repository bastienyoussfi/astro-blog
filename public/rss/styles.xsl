<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="utf-8"/>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292e;
            max-width: 860px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          @media (prefers-color-scheme: dark) {
            body {
              color: #c9d1d9;
              background: #0d1117;
            }
            a {
              color: #58a6ff;
            }
          }
          header, main, footer {
            margin: 0 auto;
          }
          h1, h2, h3 {
            margin-top: 1.5rem; 
            margin-bottom: 0.5rem;
            font-weight: 600;
            line-height: 1.25;
          }
          h1 {
            font-size: 2em;
            margin-top: 0;
          }
          h2 {
            font-size: 1.5em;
            margin-top: 2rem;
            padding-bottom: 0.3rem;
            border-bottom: 1px solid #eaecef;
          }
          @media (prefers-color-scheme: dark) {
            h2 {
              border-color: #30363d;
            }
          }
          li {
            margin: 0.25rem 0;
          }
          .meta {
            color: #6a737d;
            font-size: 0.85rem;
          }
          @media (prefers-color-scheme: dark) {
            .meta {
              color: #8b949e;
            }
          }
          a {
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          p {
            margin-top: 0;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="/rss/channel/link"/>
            </xsl:attribute>
            Visit Website &#8594;
          </a>
        </header>
        <main>
          <h2>Recent Posts</h2>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
                <div class="meta">
                  <span><xsl:value-of select="substring(pubDate, 6, 11)"/></span>
                  <xsl:if test="description">
                    <span> | <xsl:value-of select="description"/></span>
                  </xsl:if>
                </div>
              </li>
            </xsl:for-each>
          </ul>
        </main>
        <footer>
          <p class="meta">
            Generated with <a href="https://astro.build">Astro</a>.
            <br/>
            <a>
              <xsl:attribute name="href">
                <xsl:value-of select="/rss/channel/atom:link/@href"/>
              </xsl:attribute>
              RSS Feed
            </a>
          </p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet> 