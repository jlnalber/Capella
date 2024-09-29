import { Event } from "src/app/global/essentials/event";

export default abstract class AbstractSettingsComponent {
    protected afterViewInit(): void {
        this.saveEvent.addListener(this.saveListener);
    }

    protected abstract saveListener: () => void;
    protected abstract saveEvent: Event<undefined>;
    
}