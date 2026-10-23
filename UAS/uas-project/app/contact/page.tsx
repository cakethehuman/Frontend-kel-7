import ContactHero from "@/components/contact/ContactHero";
import LocationSection from "@/components/contact/LocationSection";

export default function Contact() {
    return (
        <div className="flex-grow-1 contact-main contact-page">
            <ContactHero/>
            <LocationSection/>
        </div>
    )
}