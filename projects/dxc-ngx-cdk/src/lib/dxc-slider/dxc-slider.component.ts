import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { css } from "emotion";
import { BehaviorSubject } from "rxjs";
import { CssUtils } from "../utils";
import { coerceBooleanProperty } from "@angular/cdk/coercion";

@Component({
  selector: "dxc-slider",
  templateUrl: "./dxc-slider.component.html",
  providers: [CssUtils],
})
export class DxcSliderComponent implements OnInit, OnChanges {
  @HostBinding("class") className;
  @HostBinding("class.disabled") isDisabled: boolean = false;

  //Default values
  @Input() minValue: number = 0;
  @Input() maxValue: number = 100;
  @Input() step: number = 1;
  @Input()
  get showLimitsValues(): boolean {
    return this._showLimitsValues;
  }
  set showLimitsValues(value: boolean) {
    this._showLimitsValues = coerceBooleanProperty(value);
  }
  private _showLimitsValues = false;

  @Input()
  get showInput(): boolean {
    return this._showInput;
  }
  set showInput(value: boolean) {
    this._showInput = coerceBooleanProperty(value);
  }
  private _showInput = false;

  @Input() value: number;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() required: boolean;
  @Input() margin: any;
  @Input() size: string;

  @Output() onDragEnd: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  tickInterval: any;
  renderedValue: number;

  minValueClass: any;
  maxValueClass: any;
  inputMargin = { left: "medium", top: "xxsmall" };

  defaultInputs = new BehaviorSubject<any>({
    minValue: 0,
    maxValue: 100,
    step: 1,
    showLimitsValues: false,
    showInput: false,
    value: 0,
    name: null,
    disabled: false,
    required: false,
    margin: null,
    size: null,
  });

  sizes = {
    medium: "240px",
    large: "480px",
    fillParent: "100%",
    fitContent: "unset",
  };

  constructor(private utils: CssUtils) {}

  ngOnInit() {
    this.renderedValue = this.value;

    this.updateStyles(this.defaultInputs.getValue());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.tickInterval = this.step > 1 ? 1 : 0;
    this.isDisabled = this.disabled;
    this.renderedValue = this.value;
    const inputs = Object.keys(changes).reduce((result, item) => {
      result[item] = changes[item].currentValue;
      return result;
    }, {});
    this.defaultInputs.next({ ...this.defaultInputs.getValue(), ...inputs });
    this.updateStyles(this.defaultInputs.getValue());
  }

  private updateStyles(inputs: any) {
    this.className = `${this.getDynamicStyle(inputs)}`;
    this.minValueClass = `${this.getMinLabelContainerClass()}`;
    this.maxValueClass = `${this.getMaxLabelContainerClass(inputs)}`;
  }
  /**
   * Executed while  slider value moves or when user press a key in input
   *  @param $event
   */
  public valueChanged($event: any): void {
    let newValue = ($event.target ? $event.target.value : $event.value) * 1;
    newValue = newValue < this.minValue ? this.minValue : newValue;
    newValue = newValue > this.maxValue ? this.maxValue : newValue;

    this.onChange.emit(newValue);
    if (this.value === undefined || this.value === null) {
      this.renderedValue = newValue;
    } else {
      $event.value = this.renderedValue;
      $event.source._value = this.renderedValue;
      $event.source._percent = this.renderedValue / 100;
    }
  }

  /**
   * controlled dxc-input behaviour
   *
   * @param $event
   */
  public inputValueChanged($event: any): void {
    let newValue = $event * 1;
    newValue = newValue < this.minValue ? this.minValue : newValue;
    newValue = newValue > this.maxValue ? this.maxValue : newValue;

    this.onChange.emit(newValue);
    if (this.value === undefined || this.value === null) {
      this.renderedValue = newValue;
    }
  }

  /**
   *  Eexecuted once the user has ended dragging
   * @param $event
   */
  public mouseUp($event): void {
    this.onDragEnd.emit(this.renderedValue);
  }

  calculateWidth(inputs) {
    if (inputs.size === "fillParent") {
      return this.utils.calculateWidth(this.sizes, inputs);
    }
    return css`
      width: ${this.sizes[inputs.size]};
    `;
  }

  getDynamicStyle(inputs) {
    return css`
      display: flex;
      align-items: center;
      ${this.calculateWidth(inputs)}
      ${this.utils.getMargins(inputs.margin)}
      &.disabled {
        cursor: not-allowed;
        input {
          cursor: not-allowed;
        }
      }
      mat-slider {
        flex-grow: 1;
        .mat-slider-ticks-container {
          height: 4px;
          top: -1px;
        }
        .mat-slider-track-wrapper,
        .mat-slider-track-background,
        .mat-slider-wrapper {
          height: 1px;
        }
        &:not(.mat-slider-disabled) {
          .mat-slider-track-fill {
            background-color: var(--slider-color);
          }
          .mat-slider-thumb {
            background-color: var(--slider-color);
            border-color: var(--slider-color) !important;
          }
          .mat-slider-track-background {
            opacity: var(--slider-totalLine) !important;
            background-color: var(--slider-color) !important;
          }
          .mat-slider-ticks {
            background-image: repeating-linear-gradient(
              to right,
              var(--slider-color),
              var(--slider-color) 4px 4px,
              transparent 2px,
              #e2141400
            );
            height: 4px;
          }
          &.mat-slider-sliding {
            .mat-slider-thumb {
              cursor: grabbing;
              transform: scale(1);
            }
          }
          &:focus:not(.mat-slider-sliding) {
            .mat-slider-thumb {
              transform: scale(0.7);
              outline: -webkit-focus-ring-color auto 1px;
              outline-color: var(--slider-focusColor);
              outline-offset: 3px;
            }
            .mat-slider-focus-ring {
              width: 0px;
              height: 0px;
            }
          }
          &.mat-slider-has-ticks {
            .mat-slider-ticks {
              opacity: 1 !important;
            }
          }
        }

        &.mat-slider-disabled {
          .mat-slider-thumb {
            transform: scale(0.7) !important;
            border-color: var(--slider-color) !important;
            background-color: var(--slider-color);
            opacity: var(--slider-disabledThumbBackgroundColor);
          }
          .mat-slider-track-background {
            opacity: var(--slider-disabledtotalLine) !important;
            background-color: var(--slider-color) !important;
          }
          .mat-slider-track-fill {
            opacity: var(--slider-disabledTrackLine) !important;
            background-color: var(--slider-color) !important;
          }
          .mat-slider-ticks {
            opacity: var(--slider-disabledDotsBackgroundColor) !important;
            background-image: repeating-linear-gradient(
              to right,
              var(--slider-color),
              var(--slider-color) 4px 4px,
              transparent 2px,
              #e2141400
            );
            height: 4px;
          }
        }
      }
    `;
  }

  getMinLabelContainerClass() {
    return css`
      font-size: 16px;
      margin-right: 15px;
    `;
  }

  getMaxLabelContainerClass(inputs: any) {
    return css`
      font-size: 16px;
      margin-left: ${inputs.step === 1 ? "15px" : "20px"};
    `;
  }
}
