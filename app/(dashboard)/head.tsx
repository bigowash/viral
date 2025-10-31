export default function Head() {
  const title = 'SideShift — The Growth Engine for UGC Campaigns';
  const description =
    'Scale your creator collaborations with SideShift. Source talent, manage briefs, and automate payouts in one platform.';
  const ogImage =
    'https://dummyimage.com/1200x630/F0FAFF/202020.png&text=SideShift';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
