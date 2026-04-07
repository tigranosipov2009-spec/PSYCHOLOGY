const animatedElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-scale");
const navToggle = document.querySelector(".nav-toggle");
const body = document.body;

const contactConfig = {
  telegramUrl: "",
  phoneUrl: "",
  phoneDisplay: "+7 (___) ___-__-__"
};

const quizQuestions = [
  {
    id: "feeling",
    title: "Как вы себя чувствуете в последнее время?",
    description: "Выберите то, что сейчас ближе всего вашему состоянию.",
    options: [
      {
        value: "anxiety",
        title: "Часто тревожно и напряжённо",
        note: "Мысли не отпускают, сложно спокойно выдохнуть."
      },
      {
        value: "fatigue",
        title: "Эмоционально очень устало",
        note: "Сил стало меньше, даже привычные дела даются тяжелее."
      },
      {
        value: "confused",
        title: "Растерянно и неясно",
        note: "Трудно понять, что происходит и на что опереться."
      },
      {
        value: "holding",
        title: "Будто держусь из последних сил",
        note: "Снаружи всё более-менее, но внутри уже слишком тяжело."
      }
    ]
  },
  {
    id: "concern",
    title: "Что беспокоит больше всего?",
    description: "Это поможет мягко понять, с чего лучше начать разговор.",
    options: [
      {
        value: "relationships",
        title: "Отношения и близость",
        note: "Есть напряжение, боль, одиночество или чувство, что вас не слышат."
      },
      {
        value: "selfworth",
        title: "Самооценка и внутренняя критика",
        note: "Много сомнений в себе, вины, стыда или постоянной самокритики."
      },
      {
        value: "burnout",
        title: "Выгорание и перегрузка",
        note: "Накопилась усталость, а отдых уже не возвращает силы."
      },
      {
        value: "life",
        title: "Сложный жизненный период",
        note: "Перемены, потери, кризис или общее чувство внутренней тяжести."
      }
    ]
  },
  {
    id: "duration",
    title: "Как давно это состояние с вами?",
    description: "Не нужно вспоминать точно. Достаточно общего ощущения.",
    options: [
      {
        value: "weeks",
        title: "Скорее последние недели",
        note: "Похоже, это началось сравнительно недавно."
      },
      {
        value: "months",
        title: "Уже несколько месяцев",
        note: "Состояние держится и постепенно забирает больше ресурса."
      },
      {
        value: "waves",
        title: "Давно, но волнами",
        note: "Иногда легче, потом снова становится тяжело."
      },
      {
        value: "long",
        title: "Уже довольно давно",
        note: "Похоже, это состояние давно просит внимания и опоры."
      }
    ]
  },
  {
    id: "support",
    title: "Пробовали ли вы уже что-то с этим делать?",
    description: "Здесь нет правильного ответа. Важен только ваш реальный опыт.",
    options: [
      {
        value: "self",
        title: "Пытаюсь справляться самостоятельно",
        note: "Много думаю, анализирую, читаю, но ясности всё равно не хватает."
      },
      {
        value: "close",
        title: "Обсуждал(а) это с близкими",
        note: "Поддержка есть, но внутренне легче не становится."
      },
      {
        value: "postpone",
        title: "Скорее откладываю этот вопрос",
        note: "Хочется обратиться, но сделать первый шаг пока трудно."
      },
      {
        value: "experience",
        title: "Опыт обращений уже был",
        note: "Хочется попробовать снова, но в более подходящем формате."
      }
    ]
  },
  {
    id: "format",
    title: "Какой первый шаг сейчас ощущается самым комфортным?",
    description: "Можно выбрать самый мягкий и безопасный вариант для начала.",
    options: [
      {
        value: "telegram",
        title: "Коротко написать в Telegram",
        note: "Если спокойнее сначала обозначить ситуацию сообщением."
      },
      {
        value: "form",
        title: "Оставить заявку и дождаться ответа",
        note: "Если удобнее спокойно заполнить форму в своём темпе."
      },
      {
        value: "phone",
        title: "Созвониться и задать вопросы",
        note: "Если живой голос помогает почувствовать больше опоры."
      },
      {
        value: "consultation",
        title: "Сразу обсудить консультацию",
        note: "Если вы уже готовы к более прямому и предметному контакту."
      }
    ]
  }
];

const quizContactPreferences = {
  telegram: {
    method: "telegram",
    action: "telegram",
    fallback: "#contacts",
    button: "Написать в Telegram"
  },
  form: {
    method: "any",
    action: "",
    fallback: "#application-form",
    button: "Открыть форму заявки"
  },
  phone: {
    method: "phone",
    action: "phone",
    fallback: "#contacts",
    button: "Позвонить"
  },
  consultation: {
    method: "any",
    action: "",
    fallback: "#first-contact",
    button: "Получить консультацию"
  }
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getQuizQuestion = (id) => quizQuestions.find((question) => question.id === id) || null;

const getQuizOption = (questionId, answerValue) => {
  const question = getQuizQuestion(questionId);
  return question?.options.find((option) => option.value === answerValue) || null;
};

const collectFormData = (formData) => {
  const payload = {};

  formData.forEach((value, key) => {
    payload[key] = String(value);
  });

  return payload;
};

const applyInteractiveLink = (link, type, fallback) => {
  if (!link) {
    return;
  }

  link.removeAttribute("target");
  link.removeAttribute("rel");

  if (type === "telegram" && contactConfig.telegramUrl) {
    link.setAttribute("href", contactConfig.telegramUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
    return;
  }

  if (type === "phone" && contactConfig.phoneUrl) {
    link.setAttribute("href", contactConfig.phoneUrl);
    return;
  }

  link.setAttribute("href", fallback);
};

const applyMediaFallbacks = () => {
  document.querySelectorAll("[data-media-fallback]").forEach((shell) => {
    const image = shell.querySelector("img");

    if (!image) {
      shell.classList.add("has-fallback");
      return;
    }

    const showFallback = () => {
      shell.classList.remove("has-media");
      shell.classList.add("has-fallback");
    };

    const showMedia = () => {
      shell.classList.remove("has-fallback");
      shell.classList.add("has-media");
    };

    image.addEventListener("load", showMedia, { once: true });
    image.addEventListener("error", showFallback, { once: true });

    if (image.complete) {
      if (image.naturalWidth > 0) {
        showMedia();
      } else {
        showFallback();
      }
    } else {
      shell.classList.add("has-fallback");
    }
  });
};

const applyContactLinks = () => {
  document.querySelectorAll("[data-phone-display]").forEach((node) => {
    node.textContent = contactConfig.phoneDisplay;
  });

  document.querySelectorAll("[data-contact-link='telegram']").forEach((link) => {
    applyInteractiveLink(link, "telegram", "#contacts");
  });

  document.querySelectorAll("[data-contact-link='phone']").forEach((link) => {
    applyInteractiveLink(link, "phone", "#contacts");
  });
};

const closeMenu = () => {
  body.classList.remove("menu-open");

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
};

const setupMenu = () => {
  if (!navToggle) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("menu-open")) {
      return;
    }

    const header = document.querySelector(".site-header");
    if (header && !header.contains(event.target)) {
      closeMenu();
    }
  });
};

const setupFaq = () => {
  const items = document.querySelectorAll(".faq-item");

  if (!items.length) {
    return;
  }

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      items.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });
};

const buildQuizSummary = (answers) => {
  const feelingLabel = getQuizOption("feeling", answers.feeling)?.title || "сильное внутреннее напряжение";
  const concernLabel = getQuizOption("concern", answers.concern)?.title || "то, что сейчас особенно беспокоит";
  const durationLabel = getQuizOption("duration", answers.duration)?.title || "это состояние держится уже какое-то время";
  const supportLabel = getQuizOption("support", answers.support)?.title || "вы уже пробовали искать опору";
  const formatLabel = getQuizOption("format", answers.format)?.title || "мягкий первый контакт";
  const preferred = quizContactPreferences[answers.format] || quizContactPreferences.form;

  const pills = quizQuestions
    .map((question) => getQuizOption(question.id, answers[question.id])?.title)
    .filter(Boolean);

  return {
    title: "Можно обсудить вашу ситуацию и подобрать формат",
    text: [
      `Сейчас больше всего откликаются ${concernLabel.toLowerCase()} и состояние "${feelingLabel.toLowerCase()}".`,
      `Похоже, ${durationLabel.toLowerCase()}, а значит, вам может подойти спокойный и бережный разговор без лишнего давления.`,
      `Если вам ближе формат "${formatLabel.toLowerCase()}", с него и можно начать.`
    ].join(" "),
    note: `Вы уже отмечали, что ${supportLabel.toLowerCase()}. Это тоже можно спокойно обсудить на первом контакте.`,
    pills,
    preferredMethod: preferred.method,
    preferredAction: preferred.action,
    preferredFallback: preferred.fallback,
    preferredButton: preferred.button
  };
};

const renderInlineSuccess = (container, method) => {
  if (!container) {
    return;
  }

  const configs = {
    telegram: {
      text: "Заявка отправлена. Следующий мягкий шаг — написать в Telegram.",
      action: "telegram",
      fallback: "#contacts",
      button: "Написать в Telegram"
    },
    phone: {
      text: "Заявка отправлена. Если удобнее, можно сразу перейти к звонку.",
      action: "phone",
      fallback: "#contacts",
      button: "Позвонить"
    },
    any: {
      text: "Заявка отправлена. Можно дождаться ответа или сразу открыть контакты.",
      action: "",
      fallback: "#contacts",
      button: "Открыть контакты"
    }
  };

  const current = configs[method] || configs.any;
  container.hidden = false;
  container.innerHTML = `<span>${escapeHtml(current.text)}</span>`;

  const link = document.createElement("a");
  link.textContent = current.button;
  applyInteractiveLink(link, current.action, current.fallback);
  container.append(link);
};

const setupQuiz = () => {
  const quizRoot = document.querySelector("[data-quiz-root]");
  const stage = quizRoot?.querySelector("[data-quiz-stage]");
  const progressLabel = quizRoot?.querySelector("[data-quiz-progress-label]");
  const progressBar = quizRoot?.querySelector("[data-quiz-progress-bar]");

  if (!quizRoot || !stage || !progressLabel || !progressBar) {
    return;
  }

  const state = {
    currentStep: 0,
    answers: {},
    submitted: false,
    submission: null,
    isTransitioning: false
  };

  const totalQuestions = quizQuestions.length;

  const updateProgress = () => {
    if (state.submitted) {
      progressLabel.textContent = "Готово";
      progressBar.style.width = "100%";
      return;
    }

    if (state.currentStep < totalQuestions) {
      progressLabel.textContent = `Шаг ${state.currentStep + 1} из ${totalQuestions}`;
      progressBar.style.width = `${((state.currentStep + 1) / totalQuestions) * 100}%`;
      return;
    }

    progressLabel.textContent = "Финальный шаг";
    progressBar.style.width = "100%";
  };

  const scrollQuizIntoView = () => {
    if (window.innerWidth > 860) {
      return;
    }

    const headerHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 86;
    const targetTop = window.scrollY + quizRoot.getBoundingClientRect().top - headerHeight - 18;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth"
    });
  };

  const renderQuestionStep = (question, stepIndex) => `
    <div class="quiz-panel">
      <article class="quiz-card quiz-card--question">
        <div class="quiz-card-head">
          <span class="quiz-step">Вопрос ${stepIndex + 1}</span>
          <h3>${escapeHtml(question.title)}</h3>
          <p>${escapeHtml(question.description)}</p>
        </div>

        <div class="quiz-options">
          ${question.options
            .map(
              (option) => `
                <button
                  class="quiz-option"
                  type="button"
                  data-quiz-answer="${escapeHtml(option.value)}"
                >
                  <strong>${escapeHtml(option.title)}</strong>
                  <span>${escapeHtml(option.note)}</span>
                </button>
              `
            )
            .join("")}
        </div>

        <div class="quiz-step-actions">
          ${stepIndex > 0 ? '<button class="button button-secondary quiz-back" type="button" data-quiz-back>Назад</button>' : ""}
          <p class="quiz-card-foot">Нажмите на вариант, и следующий шаг откроется автоматически.</p>
        </div>
      </article>
    </div>
  `;

  const renderFinalStep = (summary) => {
    const hiddenInputs = quizQuestions
      .map((question) => {
        const selectedOption = getQuizOption(question.id, state.answers[question.id]);
        return `
          <input type="hidden" name="quiz_${escapeHtml(question.id)}" value="${escapeHtml(selectedOption?.title || "")}" />
          <input type="hidden" name="quiz_${escapeHtml(question.id)}_value" value="${escapeHtml(selectedOption?.value || "")}" />
        `;
      })
      .join("");

    return `
      <div class="quiz-panel">
        <article class="quiz-card quiz-card--final">
          <div class="quiz-result">
            <span class="quiz-output-kicker">Итог квиза</span>
            <h3>${escapeHtml(summary.title)}</h3>
            <p>${escapeHtml(summary.text)}</p>
            <p>${escapeHtml(summary.note)}</p>
            <div class="quiz-summary">
              ${summary.pills
                .map((pill) => `<span class="quiz-summary-pill">${escapeHtml(pill)}</span>`)
                .join("")}
            </div>
          </div>

          <form class="quiz-final-form" data-quiz-form>
            <div class="quiz-final-fields">
              <div class="quiz-field">
                <label for="quiz-name">Ваше имя</label>
                <input id="quiz-name" name="name" type="text" placeholder="Как к вам обращаться" required />
              </div>

              <div class="quiz-field">
                <label for="quiz-contact">Телефон или Telegram</label>
                <input
                  id="quiz-contact"
                  name="contact"
                  type="text"
                  placeholder="+7 (...) или @username"
                  required
                />
              </div>

              <div class="quiz-field quiz-field--wide">
                <label for="quiz-contact-method">Как удобнее получить ответ</label>
                <select id="quiz-contact-method" name="contact_method" required>
                  <option value="telegram" ${summary.preferredMethod === "telegram" ? "selected" : ""}>Через Telegram</option>
                  <option value="phone" ${summary.preferredMethod === "phone" ? "selected" : ""}>По телефону</option>
                  <option value="any" ${summary.preferredMethod === "any" ? "selected" : ""}>Любым удобным способом</option>
                </select>
              </div>
            </div>

            <input type="hidden" name="quiz_summary" value="${escapeHtml(summary.pills.join(", "))}" />
            ${hiddenInputs}

            <button class="button button-secondary quiz-back" type="button" data-quiz-back>Назад</button>
            <button class="button button-primary quiz-submit" type="submit">Получить консультацию</button>
            <p class="quiz-form-note">
              Можно просто оставить контакт. Этого уже достаточно для первого спокойного ответа.
            </p>
          </form>
        </article>
      </div>
    `;
  };

  const renderSuccessStep = (summary) => `
    <div class="quiz-panel">
      <article class="quiz-card quiz-card--final">
        <div class="quiz-success">
          <span class="quiz-output-kicker">Заявка отправлена</span>
          <h3>Спасибо. Первый шаг уже сделан.</h3>
          <p>
            Ответы из квиза уже сохранены вместе с вашим запросом. Дальше можно спокойно
            перейти к удобному способу связи или дождаться ответа.
          </p>
          <div class="quiz-summary">
            ${summary.pills
              .map((pill) => `<span class="quiz-summary-pill">${escapeHtml(pill)}</span>`)
              .join("")}
          </div>
          <div class="quiz-success-actions">
            <a class="button button-primary" href="${escapeHtml(summary.preferredFallback)}" data-quiz-success-link>
              ${escapeHtml(summary.preferredButton)}
            </a>
            <a class="button button-secondary" href="#contacts">Открыть контакты</a>
          </div>
        </div>
      </article>
    </div>
  `;

  const bindQuestionStep = () => {
    const currentQuestion = quizQuestions[state.currentStep];

    stage.querySelectorAll("[data-quiz-back]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.isTransitioning || state.currentStep === 0) {
          return;
        }

        state.currentStep -= 1;
        renderStage({ animate: true, shouldScroll: true });
      });
    });

    stage.querySelectorAll("[data-quiz-answer]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.isTransitioning || !currentQuestion) {
          return;
        }

        const answerValue = button.getAttribute("data-quiz-answer");

        if (!answerValue) {
          return;
        }

        state.isTransitioning = true;
        state.answers[currentQuestion.id] = answerValue;

        stage.querySelectorAll("[data-quiz-answer]").forEach((option) => {
          option.setAttribute("disabled", "true");
        });

        button.classList.add("is-selected");

        window.setTimeout(() => {
          state.currentStep += 1;
          renderStage({ animate: true, shouldScroll: true });
          state.isTransitioning = false;
        }, 240);
      });
    });
  };

  const bindFinalStep = () => {
    const form = stage.querySelector("[data-quiz-form]");

    if (!form) {
      return;
    }

    const backButton = form.querySelector("[data-quiz-back]");
    if (backButton) {
      backButton.addEventListener("click", () => {
        if (state.isTransitioning) {
          return;
        }

        state.currentStep = Math.max(totalQuestions - 1, 0);
        renderStage({ animate: true, shouldScroll: true });
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      state.submission = collectFormData(formData);
      state.submitted = true;

      renderStage({ animate: true, shouldScroll: true });
    });
  };

  const bindSuccessStep = (summary) => {
    const primaryLink = stage.querySelector("[data-quiz-success-link]");

    if (!primaryLink) {
      return;
    }

    applyInteractiveLink(primaryLink, summary.preferredAction, summary.preferredFallback);
  };

  const bindCurrentStep = (summary) => {
    if (state.submitted) {
      bindSuccessStep(summary);
      return;
    }

    if (state.currentStep < totalQuestions) {
      bindQuestionStep();
      return;
    }

    bindFinalStep();
  };

  const renderStage = ({ animate = true, shouldScroll = false } = {}) => {
    const summary = buildQuizSummary(state.answers);
    let markup = "";

    if (state.submitted) {
      markup = renderSuccessStep(summary);
    } else if (state.currentStep < totalQuestions) {
      markup = renderQuestionStep(quizQuestions[state.currentStep], state.currentStep);
    } else {
      markup = renderFinalStep(summary);
    }

    updateProgress();

    const commitRender = () => {
      stage.innerHTML = markup;
      stage.classList.remove("is-switching");
      bindCurrentStep(summary);

      if (shouldScroll) {
        window.requestAnimationFrame(scrollQuizIntoView);
      }
    };

    if (animate) {
      stage.classList.add("is-switching");
      window.setTimeout(commitRender, 180);
      return;
    }

    commitRender();
  };

  renderStage({ animate: false, shouldScroll: false });
};

const setupForm = () => {
  const form = document.querySelector(".application-form");
  const success = document.querySelector("[data-form-success]");

  if (!form || !success) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const method = String(formData.get("contact_method") || "any");
    renderInlineSuccess(success, method);
  });
};

const setupRevealObserver = () => {
  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
};

applyMediaFallbacks();
applyContactLinks();
setupMenu();
setupFaq();
setupQuiz();
setupForm();
setupRevealObserver();
