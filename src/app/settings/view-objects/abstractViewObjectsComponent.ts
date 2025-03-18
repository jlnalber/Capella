import { Point } from "src/app/global/interfaces/point";
import { Event as CustomEvent } from 'src/app/global/essentials/event';
import AbstractSettingsComponent from "../abstractSettingComponent";
import { ContextMenu, ContextMenuDirective } from "src/app/global/context-menu/context-menu.directive";
import { FormulaElement } from "src/app/prokyon/global/classes/abstract/formulaElement";
import AbstractPickerComponent from "src/app/global/style-components/abstractPickerComponent";
import { Type } from "@angular/core";
import Picker from "src/app/global/style-components/pickers/picker";
import { PickerDialogComponent, PickerDialogData } from "src/app/whiteboard/dialogs/picker-dialog/picker-dialog.component";
import { WhiteboardService } from "src/app/whiteboard/services/whiteboard.service";
import { RED_FILTER } from "src/app/global/interfaces/color";
import { ConfirmationDialogComponent } from "src/app/global/dialog/confirmation-dialog/confirmation-dialog.component";
import { ViewObjectsData, ViewObjectsDataObject } from "./view-objects.component";

type ObjectAndEvent<T extends TWrapper> = [T, CustomEvent<[Point, Event]>];

type TWrapper = {
    name: string,
    icon?: string
}

export default abstract class AbstractViewObjectsComponent<T extends TWrapper, E extends AbstractPickerComponent<Picker<T>, T>> extends AbstractSettingsComponent {
    public threePointsClicked(event: MouseEvent, p: ObjectAndEvent<T>) {
        ContextMenuDirective.threePointsClicked(event, FormulaElement.getDOMRectOfIconButton(event), p[1]);
    }
    
    public getContextMenuForPen(p: ObjectAndEvent<T>, isDefault: boolean): ContextMenu {
        return {
            elements: () => [{
                header: 'Bearbeiten',
                title: `${this.objectName[0]} bearbeiten`,
                disabled: isDefault,
                click: () => {
                    const picker = new Picker<T>(() => this.getCopyOfObject(p[0]), (obj?: T) => {
                        p[0] = obj ?? p[0];
                        this.resetData();
                    });
                    const pickerDialogData: PickerDialogData<E, T> = {
                        componentType: this.pickerComponentType,
                        title: `${this.objectName[0]} bearbeiten`,
                        picker: picker
                    }
                    PickerDialogComponent.openPickerDialogComponent(this.whiteboardService.dialogService, pickerDialogData)
                },
                icon: 'edit'
            }, {
                header: 'Duplizieren',
                title: `${this.objectName[0]} duplizieren`,
                click: () => {
                    const index = this.defaultObjects.indexOf(p);
                    this.additionalObjects.push([this.getCopyOfObject(p[0], index === -1 ? undefined : index), new CustomEvent<[Point, Event]>()])
                    this.resetData();
                },
                icon: 'copy'
            }, {
                header: 'Löschen',
                title: `${this.objectName[0]} löschen`,
                disabled: isDefault,
                filter: RED_FILTER,
                click: () => {
                ConfirmationDialogComponent.confirm(this.whiteboardService.dialogService, {
                    yes: () => {
                        const index = this.additionalObjects.indexOf(p);
                        if (index !== -1) {
                            this.additionalObjects.splice(index, 1);
                            this.resetData();
                        }
                    },
                    title: `${this.objectName[0]} "${p[0].name}" löschen?`,
                    text: 'Diese Aktion kann nicht mehr rückgängig gemacht werden.'
                })
                },
                icon: 'trash'
            }],
            additionalEvent: p[1]
        }
    }
    
    public add() {
        this.additionalObjects.push([this.getCopyOfObject(this.defaultObject), new CustomEvent<[Point, Event]>()]);
        this.resetData();
    }
    
    protected resetData() {
        const objects: ViewObjectsDataObject<ObjectAndEvent<T>>[] = this.defaultObjects.map(p => ({
            object: p,
            getContextMenu: () => this.getContextMenuForPen(p, true),
            threePointsClicked: (event: MouseEvent) => this.threePointsClicked(event, p),
            name: p[0].name,
            icon: p[0].icon
        })).concat(this.additionalObjects.map(p => ({
            object: p,
            getContextMenu: () => this.getContextMenuForPen(p, false),
            threePointsClicked: (event: MouseEvent) => this.threePointsClicked(event, p),
            name: p[0].name,
            icon: p[0].icon
        })));
    
        this.data = {
            title: `${this.objectName[1]} bearbeiten`,
            add: () => this.add(),
            objects: objects
        }
    }
    
    public data?: ViewObjectsData<ObjectAndEvent<T>>;
    
    public readonly defaultObjects: ObjectAndEvent<T>[];
    public readonly additionalObjects: ObjectAndEvent<T>[];


    constructor(public readonly whiteboardService: WhiteboardService,
                protected readonly objectName: [string, string],
                protected readonly getCopyOfObject: (object: T, index?: number) => T,
                protected readonly pickerComponentType: Type<E>,
                protected readonly defaultObject: T) {
        super();
        this.defaultObjects = this.getDefaultObjects().map(p => [p, new CustomEvent<[Point, Event]>()]);
        this.additionalObjects = this.getAdditionalObjects().map(p => [p, new CustomEvent<[Point, Event]>()]);
        this.resetData();
    }

    protected abstract getDefaultObjects(): T[];
    protected abstract getAdditionalObjects(): T[];
    protected abstract saveAdditionObjects(objs: T[]): void;

    protected destroy() {
        this.closed = true;
    }

    protected save() {
        this.saveAdditionObjects(this.additionalObjects.map(p => p[0]));
    }

}