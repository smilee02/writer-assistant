import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModalComponentStyle } from "./modal-component.style.js";
import LocalizationService from "../../services/localization-service.js";
import { GlobalStyles } from "../../styles/global-style.js";

/**
 * @summary ModalComponent provides a basic modal dialog for displaying messages.
 * @description The modal can be used to show a simple alert or to ask for confirmation with "Ok" and "Cancel" buttons. It dispatches a "confirm" event with a boolean indicating the user's choice.
 *
 * @customElement modal-component
 * @status stable
 * @since 1.0
 *
 * @property {boolean} open - Controls the visibility of the modal.
 * @property {string} message - The message displayed in the modal.
 * @property {string} type - The type of modal, either 'alert' or 'confirm'.
 *
 * @csspart modal-overlay - The overlay behind the modal.
 * @csspart modal - The container for the modal content.
 * @csspart modal-buttons - The container for the modal buttons.
 * @csspart modal-confirm-button - The "Ok" button in the modal.
 * @csspart modal-cancel-button - The "Cancel" button in the modal.
 *
 * @cssproperty --modal-background-color - The background color of the modal.
 * @cssproperty --modal-overlay-color - The color of the overlay behind the modal.
 *
 */
@customElement("modal-component")
export class ModalComponent extends LitElement {
  static styles = [GlobalStyles, ModalComponentStyle];

  /**
   * Controls the visibility of the modal.
   * @type {boolean}
   */
  @property({ type: Boolean })
  open = false;

  /**
   * The message displayed in the modal.
   * @type {string}
   */
  @property({ type: String })
  message = "";

  /**
   * The type of modal, either 'alert' or 'confirm'.
   * @type {string}
   */
  @property({ type: String })
  type = "";

  /**
   * Service for localization.
   * @type {LocalizationService}
   */
  i18nextService: LocalizationService;

  constructor() {
    super();
    this.i18nextService = LocalizationService.getInstance();
  }

  /**
   * Closes the modal and dispatches a "confirm" event with `false` as the detail.
   * This is used to cancel the action when the user clicks outside the modal or on the cancel button.
   */
  private close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("confirm", { detail: false }));
  }

  /**
   * Handles the confirmation action. Dispatches a "confirm" event with `true` as the detail.
   * This is used to confirm the action when the user clicks on the "Ok" button.
   */
  private handleConfirm() {
    this.dispatchEvent(new CustomEvent("confirm", { detail: true }));
    this.close();
  }

  /**
   * Handles the cancel action. Dispatches a "confirm" event with `false` as the detail.
   * This is used when the user clicks on the "Cancel" button.
   */
  private handleCancel() {
    this.dispatchEvent(new CustomEvent("confirm", { detail: false }));
    this.close();
  }

  render() {
    if (!this.open) return null;

    return html`
      <div
        class="modal-overlay"
        part="modal-overlay"
        @click=${this.close}
      ></div>
      <div class="modal" part="modal">
        <p>${this.message}</p>
        <div class="modal-buttons" part="modal-buttons">
          ${this.type === "confirm"
            ? html`
                <button
                  class="modal-confirm-button"
                  part="modal-confirm-button"
                  @click=${this.handleConfirm}
                >
                  ${this.i18nextService.t("modal.buttons.ok")}
                </button>
                <button
                  class="modal-cancel-button"
                  part="modal-cancel-button"
                  @click=${this.handleCancel}
                >
                  ${this.i18nextService.t("modal.buttons.cancel")}
                </button>
              `
            : html`<button
                class="modal-confirm-button"
                part="modal-confirm-button"
                @click=${this.close}
              >
                ${this.i18nextService.t("modal.buttons.ok")}
              </button>`}
        </div>
      </div>
    `;
  }
}
