import ContactHero from "@/components/contact/ContactHero";
import LocationSection from "@/components/contact/LocationSection";
import ContactList from "@/components/contact/ContactList";
import FeedbackForm from "@/components/contact/FeedbackForm";

export default function Contact() {
    return (
        <div className="flex-grow-1 contact-main contact-page">
            <ContactHero/>
            <LocationSection/>
            <ContactList/>
            <FeedbackForm/>
        </div>
    )
}