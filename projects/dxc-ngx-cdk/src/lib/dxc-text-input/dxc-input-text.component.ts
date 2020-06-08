import {
  Component,
  OnChanges,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewChild
} from "@angular/core";
import { ErrorStateMatcher } from "@angular/material";
import { css } from "emotion";
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CssUtils } from "../utils";
import { ElementRef, OnInit, AfterViewChecked } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dxc-input-text",
  templateUrl: "./dxc-input-text.component.html",
  styleUrls: ["./dxc-light-input.scss", "./dxc-dark-input.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CssUtils]
})
export class DxcTextInputComponent
  implements OnInit, OnChanges, AfterViewChecked {
  @HostBinding("class") className;
  @HostBinding("class.dxc-light") isLight: boolean = true;
  @HostBinding("class.dxc-dark") isDark: boolean = false;
  @HostBinding("class.disabled") isDisabled: boolean = false;
  @Input() public prefix: string;
  @Input() public suffix: string;
  @Input() public prefixIconSrc: string;
  @Input() public suffixIconSrc: string;

  @Input() public theme: string = "light";
  @Input() public disabled: boolean = false;
  @Input() public required: boolean = false;
  @Input() public multiline: boolean = false;
  @Input() public invalid: boolean = false;

  @Input() public label: String;
  @Input() public assistiveText: string;
  @Input() public name: string;
  @Input() public value: string;
  @Input() public placeholder: string;
  @Input() public autocompleteOptions: any;

  @Input() public margin: any;
  @Input() public size: string;

  @Output() public onClickSuffix: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onClickPrefix: EventEmitter<any> = new EventEmitter<any>();
  @Output() public onChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public onBlur: EventEmitter<any> = new EventEmitter<any>();

  renderedValue = "";
  private _valueChangeTrack: boolean;
  options = [];

  @ViewChild("dxcSingleInput", { static: false }) singleInput: ElementRef;
  @ViewChild("dxcMultiInput", { static: false }) multiInput: ElementRef;

  selectionStart: number = 0;
  selectionEnd: number = 0;
  clicked: boolean = false;

  sizes = {
    small: "42px",
    medium: "240px",
    large: "480px",
    fillParent: "100%"
  };

  defaultInputs = new BehaviorSubject<any>({
    prefix: null,
    suffix: null,
    prefixIconSrc: null,
    suffixIconSrc: null,
    theme: "light",
    disabled: false,
    required: false,
    multiline: false,
    invalid: false,
    label: null,
    assistiveText: null,
    placeholder: null,
    name: null,
    value: null,
    margin: null,
    size: "medium"
  });

  public formControl = new FormControl();
  public matcher = new InvalidStateMatcher();

  constructor(private utils: CssUtils) {}

  ngOnInit() {
    this.renderedValue = this.value || "";
    this.className = `${this.getDynamicStyle(this.defaultInputs.getValue())}`;
    if (this.autocompleteOptions && Array.isArray(this.autocompleteOptions)) {
      this.options = this.autocompleteOptions;
    } else if (
      this.autocompleteOptions &&
      typeof this.autocompleteOptions === "function"
    ) {
      this.autocompleteOptions().subscribe(
        autocompleteOptionsList => {
          this.options = autocompleteOptionsList;
        },
        err => (this.options = ["Error"])
      );
    }
  }

  ngAfterViewChecked(): void {
    if (this._valueChangeTrack) {
      this._valueChangeTrack = false;
      this.multiline
        ? this.setCursorSelection(this.multiInput)
        : this.setCursorSelection(this.singleInput);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.value && changes.value.currentValue) {
      this.autocompleteFunction(changes.value.currentValue);
    }
    if (this.theme === "dark") {
      this.isLight = false;
      this.isDark = true;
    } else {
      this.isLight = true;
      this.isDark = false;
    }
    this.isDisabled = this.disabled;

    this.renderedValue = this.value || "";
    this.label = this.label || "";
    this.matcher.setInvalid(this.invalid);

    const inputs = Object.keys(changes).reduce((result, item) => {
      result[item] = changes[item].currentValue;
      return result;
    }, {});

    this.defaultInputs.next({ ...this.defaultInputs.getValue(), ...inputs });
    this.className = `${this.getDynamicStyle(this.defaultInputs.getValue())}`;
    this._valueChangeTrack = true;
  }

  public onChanged($event: any): void {
    this.clicked = false;
    this.selectionStart = $event.target.selectionStart;
    this.selectionEnd = $event.target.selectionEnd;
    this.onChange.emit($event.target.value);

    if (this.value === undefined || this.value === null) {
      this.renderedValue = $event.target.value;
      this.autocompleteFunction(this.renderedValue);
    } else {
      $event.target.value = this.renderedValue;
    }
  }

  public onClickOption($event: any) {
    this.onChange.emit($event);
    if (this.value === undefined || this.value === null) {
      this.renderedValue = $event;
    } else {
      this.singleInput.nativeElement.value = this.renderedValue;
    }
  }

  autocompleteFunction(value) {
    if (
      value &&
      value !== undefined &&
      this.autocompleteOptions &&
      Array.isArray(this.autocompleteOptions)
    ) {
      const inputValue = value.toLowerCase();
      this.options = this.autocompleteOptions.filter(option =>
        option.toLowerCase().includes(inputValue)
      );
    } else if (
      this.autocompleteOptions &&
      typeof this.autocompleteOptions === "function"
    ) {
      this.options = ["Searching..."];
      this.autocompleteOptions().subscribe(
        autocompleteOptionsList => {
          this.options = autocompleteOptionsList;
        },
        err => (this.options = ["Error"])
      );
    }
  }

  /**
   * internal click event handler
   *
   * @param $event
   */
  public onClickHandle($event): void {
    this.clicked = true;
  }

  /**
   *Executed when input lost the focus
   */
  public onBlurHandle($event: any): void {
    this.onBlur.emit(this.renderedValue);
  }

  public onClickSuffixHandler($event): void {
    this.onClickSuffix.emit($event);
  }

  public onClickPrefixHandler($event): void {
    this.onClickPrefix.emit($event);
  }

  private setCursorSelection(input: ElementRef) {
    if (!this.clicked && input) {
      input.nativeElement.selectionStart = this.selectionStart;
      input.nativeElement.selectionEnd = this.selectionEnd;
    }
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
      min-height: 34px;
      max-height: 74px;
      ${this.calculateWidth(inputs)}
      ${this.utils.getMargins(inputs.margin)}
      display: inline-flex;

      .prefixElement {
        margin-right: 12px;
      }
      .suffixElement {
        margin-left: 8px;
        margin-right: 8px;
      }

      textarea {
        min-height: 76px;
        max-height: 100px;
        ${this.utils.calculateMinWidth(this.sizes, inputs.margin)}
        max-width: 726px;
        &::-webkit-scrollbar {
          width: 3px;
        }
        &::-webkit-scrollbar-track {
          background-color: var(--lightGrey, #d9d9d9);
          border-radius: 3px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: var(--darkGrey, #666666);
          border-radius: 3px;
        }
      }

      &.disabled {
        cursor: not-allowed;
      }
      .mat-form-field {
        line-height: unset;
        width: 100%;
        max-height: 74px;
        input {
          min-height: 22px;
          text-overflow: ellipsis;
        }
        img {
          width: 20px;
          height: 20px;
        }
        &.disabled {
          pointer-events: none;
        }
      }

      .mat-form-field {
        &.mat-form-field-should-float {
          .mat-form-field-infix {
            padding-bottom: 7px;
          }
          mat-label {
            font-size: 15px;
          }
        }

        .mat-form-field-label-wrapper {
          display: flex;
          .mat-form-field-label {
            flex-direction: row-reverse;
            justify-content: flex-end;
            display: flex;
          }
        }
        .mat-form-field-subscript-wrapper {
          margin-top: 6px;
        }

        .mat-form-field-infix {
          padding-top: 6px;
        }
      }

      .mat-form-field-flex {
        align-items: center;
        .mat-form-field-infix {
          border-top: unset;
        }
      }
    `;
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
class InvalidStateMatcher implements ErrorStateMatcher {
  private invalid: boolean;
  isErrorState(): boolean {
    return this.invalid;
  }

  public setInvalid(invalid: boolean): void {
    this.invalid = invalid;
  }
}
