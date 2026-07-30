import AnnouncementBar from "@/features/homepage/AnnouncementBar";
import Navbar from "@/features/homepage/Navbar";
import HeroPage from "@/components/hero/heroPage";
import Container from "@/components/layout/Container";
import FlashDeals from "@/components/flashdeals/Flashdeals";
import CategorySection from "@/components/categories/Categories";
import FooterContainer from "@/components/footer/FooterContainer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
<HeroPage />
<Container>
<CategorySection />
<FlashDeals />
</Container>
<FooterContainer />

    </>
  );

}