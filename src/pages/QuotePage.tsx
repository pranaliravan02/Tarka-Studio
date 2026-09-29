import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  QUOTE_CURRENCY,
  QUOTE_GST_RATE,
  serviceCategories,
  type ServiceItem,
} from "../data/services";

import { generateQuotationPdf } from "../utils/generateQuotationPdf";

import "./QuotePage.css";

interface CartItem {
  service: ServiceItem;
  quantity: number;
}

interface ClientDetails {
  name: string;
  email: string;
  projectName: string;
  notes: string;
}

function formatMoney(value: number) {
  return `${QUOTE_CURRENCY}${Math.round(value).toLocaleString(
    "en-IN"
  )}`;
}

function QuotePage() {
  const [searchParams] = useSearchParams();

  const domainId = searchParams.get("domain");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [includeGst, setIncludeGst] = useState(true);
  const [showClientForm, setShowClientForm] = useState(false);
  const [generatedQuoteNumber, setGeneratedQuoteNumber] =
    useState("");

  const [client, setClient] = useState<ClientDetails>({
    name: "",
    email: "",
    projectName: "",
    notes: "",
  });

  const recommendedCategory = useMemo(() => {
    if (!domainId) return null;

    return serviceCategories.find((category) =>
      category.services.some(
        (service) => service.domainId === domainId
      )
    );
  }, [domainId]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total +
          item.service.price * item.quantity,
        0
      ),
    [cart]
  );

  const gst = includeGst
    ? subtotal * QUOTE_GST_RATE
    : 0;

  const grandTotal = subtotal + gst;

  const addService = (service: ServiceItem) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.service.id === service.id
      );

      if (existing) {
        return current.map((item) =>
          item.service.id === service.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          service,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (
    serviceId: string,
    change: number
  ) => {
    setCart((current) =>
      current
        .map((item) =>
          item.service.id === serviceId
            ? {
                ...item,
                quantity:
                  item.quantity + change,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeService = (serviceId: string) => {
    setCart((current) =>
      current.filter(
        (item) => item.service.id !== serviceId
      )
    );
  };

  const isInCart = (serviceId: string) =>
    cart.some(
      (item) => item.service.id === serviceId
    );

  const getQuantity = (serviceId: string) =>
    cart.find(
      (item) => item.service.id === serviceId
    )?.quantity ?? 0;

  const generateQuoteNumber = () => {
    const year = new Date().getFullYear();

    const storageKey =
      `tarka_quote_seq_${year}`;

    const currentSequence = Number(
      localStorage.getItem(storageKey) ?? "0"
    );

    const nextSequence =
      currentSequence + 1;

    localStorage.setItem(
      storageKey,
      String(nextSequence)
    );

    return `TK-${year}-${String(
      nextSequence
    ).padStart(3, "0")}`;
  };

  const updateClient = (
    field: keyof ClientDetails,
    value: string
  ) => {
    setClient((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleGenerateQuote = () => {
    if (cart.length === 0) {
      return;
    }

    if (
      !client.name.trim() ||
      !client.email.trim() ||
      !client.projectName.trim()
    ) {
      setShowClientForm(true);
      return;
    }

    const quoteNumber =
      generateQuoteNumber();

    const quoteData = {
      quoteNumber,
      date: new Date(),
      client,
      items: cart,
      subtotal,
      gst,
      grandTotal,
      includeGst,
    };

    /*
     * Save the latest quotation locally.
     * This allows us to reuse the information later
     * if we expand the quote workflow.
     */
    localStorage.setItem(
      "tarka_last_quote",
      JSON.stringify({
        ...quoteData,
        date: quoteData.date.toISOString(),
      })
    );

    /*
     * Generate and download the actual PDF.
     */
    generateQuotationPdf(quoteData);

    setGeneratedQuoteNumber(
      quoteNumber
    );

    setShowClientForm(false);
  };

  /*
   * If a quotation has been generated,
   * show the confirmation screen.
   */
  if (generatedQuoteNumber) {
    return (
      <main className="quote-page quote-page--success">
        <header className="quote-nav">
          <Link
            to="/"
            className="quote-logo"
          >
            TARKA
          </Link>

          <span className="quote-nav__label">
            QUOTATION / {generatedQuoteNumber}
          </span>

          <Link
            to="/"
            className="quote-nav__back"
          >
            Back to Tarka ↗
          </Link>
        </header>

        <section className="quote-success">
          <div className="quote-success__number">
            {generatedQuoteNumber}
          </div>

          <p className="quote-eyebrow">
            QUOTATION GENERATED
          </p>

          <h1>
            Your quote
            <br />
            <em>is ready.</em>
          </h1>

          <p className="quote-success__description">
            Your Tarka quotation has been
            generated and downloaded as a PDF.
          </p>

          <div className="quote-success__total">
            <span>Estimated total</span>

            <strong>
              {formatMoney(grandTotal)}
            </strong>
          </div>

          <div className="quote-success__actions">
            <button
              type="button"
              className="quote-primary-button"
              onClick={() =>
                setGeneratedQuoteNumber("")
              }
            >
              <span>
                Build another quote
              </span>

              <span>↗</span>
            </button>

            <Link
              to="/"
              className="quote-secondary-button"
            >
              <span>
                Return home
              </span>

              <span>↗</span>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="quote-page">
      <header className="quote-nav">
        <Link
          to="/"
          className="quote-logo"
        >
          TARKA
        </Link>

        <span className="quote-nav__label">
          BUILD YOUR QUOTATION
        </span>

        <Link
          to="/"
          className="quote-nav__back"
        >
          Back to Tarka ↗
        </Link>
      </header>

      <section className="quote-intro">
        <div>
          <p className="quote-eyebrow">
            TARKA / QUOTE BUILDER
          </p>

          <h1>
            Build the
            <br />
            <em>right scope.</em>
          </h1>
        </div>

        <p className="quote-intro__description">
          Select the services you need,
          adjust quantities and build an
          estimated project quotation.
        </p>
      </section>

      <div className="quote-layout">
        <section className="quote-catalog">
          <div className="quote-section-heading">
            <span>01</span>

            <div>
              <p>SERVICES</p>
              <h2>
                Choose what you need.
              </h2>
            </div>
          </div>

          {serviceCategories.map(
            (category) => {
              const isRecommended =
                recommendedCategory?.id ===
                category.id;

              return (
                <section
                  key={category.id}
                  className={`quote-category ${
                    isRecommended
                      ? "quote-category--recommended"
                      : ""
                  }`}
                >
                  <div className="quote-category__header">
                    <div>
                      <span>
                        {category.shortName}
                      </span>

                      <h3>
                        {category.name}
                      </h3>
                    </div>

                    {isRecommended && (
                      <span className="quote-category__recommended">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="quote-services">
                    {category.services.map(
                      (service, index) => {
                        const quantity =
                          getQuantity(
                            service.id
                          );

                        const selected =
                          isInCart(
                            service.id
                          );

                        return (
                          <article
                            key={
                              service.id
                            }
                            className={`quote-service ${
                              selected
                                ? "quote-service--selected"
                                : ""
                            }`}
                          >
                            <div className="quote-service__main">
                              <div className="quote-service__index">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </div>

                              <div className="quote-service__content">
                                <h4>
                                  {
                                    service.name
                                  }
                                </h4>

                                <p>
                                  {
                                    service.description
                                  }
                                </p>

                                <span>
                                  {
                                    service.unit
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="quote-service__action">
                              <strong>
                                {formatMoney(
                                  service.price
                                )}
                              </strong>

                              {selected ? (
                                <div className="quote-quantity">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        service.id,
                                        -1
                                      )
                                    }
                                    aria-label={`Decrease ${service.name}`}
                                  >
                                    −
                                  </button>

                                  <span>
                                    {quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        service.id,
                                        1
                                      )
                                    }
                                    aria-label={`Increase ${service.name}`}
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="quote-add-button"
                                  onClick={() =>
                                    addService(
                                      service
                                    )
                                  }
                                >
                                  <span>
                                    Add
                                  </span>

                                  <span>
                                    +
                                  </span>
                                </button>
                              )}
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </section>
              );
            }
          )}
        </section>

        <aside className="quote-summary">
          <div className="quote-summary__sticky">
            <div className="quote-summary__header">
              <div>
                <span>02</span>
                <p>YOUR SCOPE</p>
              </div>

              <span>
                {cart.length}{" "}
                {cart.length === 1
                  ? "SERVICE"
                  : "SERVICES"}
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="quote-summary__empty">
                <div className="quote-summary__empty-orb">
                  +
                </div>

                <p>
                  Your quotation is empty.
                  <br />
                  Add services to begin.
                </p>
              </div>
            ) : (
              <>
                <div className="quote-summary__items">
                  {cart.map(
                    (item) => (
                      <div
                        key={
                          item.service.id
                        }
                        className="quote-summary__item"
                      >
                        <div>
                          <span>
                            {String(
                              item.quantity
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <strong>
                            {
                              item
                                .service
                                .name
                            }
                          </strong>
                        </div>

                        <div>
                          <b>
                            {formatMoney(
                              item.service
                                .price *
                                item.quantity
                            )}
                          </b>

                          <button
                            type="button"
                            onClick={() =>
                              removeService(
                                item
                                  .service
                                  .id
                              )
                            }
                            aria-label={`Remove ${item.service.name}`}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="quote-summary__gst">
                  <div>
                    <span>
                      GST
                    </span>

                    <small>
                      18%
                    </small>
                  </div>

                  <button
                    type="button"
                    className={`quote-toggle ${
                      includeGst
                        ? "quote-toggle--active"
                        : ""
                    }`}
                    onClick={() =>
                      setIncludeGst(
                        (current) =>
                          !current
                      )
                    }
                    aria-pressed={
                      includeGst
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="quote-summary__totals">
                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {formatMoney(
                        subtotal
                      )}
                    </strong>
                  </div>

                  {includeGst && (
                    <div>
                      <span>
                        GST
                      </span>

                      <strong>
                        {formatMoney(
                          gst
                        )}
                      </strong>
                    </div>
                  )}

                  <div className="quote-summary__grand">
                    <span>
                      Estimated total
                    </span>

                    <strong>
                      {formatMoney(
                        grandTotal
                      )}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="quote-generate-button"
                  onClick={
                    handleGenerateQuote
                  }
                >
                  <span>
                    Generate Quotation
                  </span>

                  <span>
                    ↗
                  </span>
                </button>
              </>
            )}

            <div className="quote-summary__note">
              <span>*</span>

              <p>
                This is an estimated
                quotation. Final scope,
                timeline and pricing are
                confirmed at kickoff.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {showClientForm && (
        <div
          className="quote-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-client-title"
        >
          <div className="quote-modal__backdrop" />

          <div className="quote-modal__panel">
            <button
              type="button"
              className="quote-modal__close"
              onClick={() =>
                setShowClientForm(
                  false
                )
              }
              aria-label="Close client details"
            >
              ×
            </button>

            <p className="quote-eyebrow">
              FINAL STEP
            </p>

            <h2 id="quote-client-title">
              Tell us who
              <br />
              <em>
                we're quoting.
              </em>
            </h2>

            <p className="quote-modal__description">
              Add a few details so we
              can prepare your
              quotation.
            </p>

            <div className="quote-form">
              <label>
                <span>
                  Your name *
                </span>

                <input
                  type="text"
                  value={
                    client.name
                  }
                  onChange={(
                    event
                  ) =>
                    updateClient(
                      "name",
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter your name"
                />
              </label>

              <label>
                <span>
                  Email address *
                </span>

                <input
                  type="email"
                  value={
                    client.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateClient(
                      "email",
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>
                  Project name *
                </span>

                <input
                  type="text"
                  value={
                    client.projectName
                  }
                  onChange={(
                    event
                  ) =>
                    updateClient(
                      "projectName",
                      event.target
                        .value
                    )
                  }
                  placeholder="What are we building?"
                />
              </label>

              <label>
                <span>
                  Project notes
                </span>

                <textarea
                  value={
                    client.notes
                  }
                  onChange={(
                    event
                  ) =>
                    updateClient(
                      "notes",
                      event.target
                        .value
                    )
                  }
                  placeholder="Tell us anything important about the project..."
                  rows={4}
                />
              </label>

              <button
                type="button"
                className="quote-generate-button"
                onClick={
                  handleGenerateQuote
                }
              >
                <span>
                  Generate
                  Quotation
                </span>

                <span>
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default QuotePage;