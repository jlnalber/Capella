import { AfterViewInit, Component, ComponentRef, Input, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import AbstractSettingsComponent from 'src/app/settings/abstractSettingComponent';

@Component({
  selector: 'app-view-settings',
  standalone: true,
  imports: [],
  templateUrl: './view-settings.component.html',
  styleUrl: './view-settings.component.scss'
})
export class ViewSettingsComponent<T extends AbstractSettingsComponent> implements AfterViewInit, OnDestroy {

  @ViewChild('contentDiv', { read: ViewContainerRef }) contentDiv!: ViewContainerRef;

  public get saveListener(): (() => void) | undefined {
    return this.component?.instance.saveListener;
  }

  @Input({ required: true }) public componentType?: Type<T>;
  @Input() public onCreated?: (component: ComponentRef<T>) => void;
  @Input() public onDestroyed?: () => void;
  public component?: ComponentRef<T>;

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.componentType) {
        this.component = this.contentDiv.createComponent(this.componentType);
        if (this.onCreated) {
          this.onCreated(this.component);
        }
      }
    }, 0);
  }

  public ngOnDestroy(): void {
    if (this.onDestroyed) {
      this.onDestroyed();
    }
  }

}
