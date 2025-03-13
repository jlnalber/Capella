export default abstract class AbstractSettingsComponent {

    public saveListener: () => void = () => {
        if (!this.closed) {
            this.save();
        }
    };
    
    protected abstract save(): void;
    protected closed: boolean = false; 
}