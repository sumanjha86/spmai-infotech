/* ----------------------------------------------------
   SPMAI INFOTECH Interactive Client Logic (Vanilla JS)
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 2. Fallback for CSS Scroll-Driven Shrinking Header (for unsupported browsers like Firefox)
  const isScrollDrivenSupported = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
  
  if (!isScrollDrivenSupported) {
    const header = document.getElementById('main-header');
    const initialHeight = 90;
    const finalHeight = 65;
    const scrollDistance = 150;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const scrollPercent = Math.min(1, scrollY / scrollDistance);
      const newHeight = initialHeight - (initialHeight - finalHeight) * scrollPercent;
      
      header.style.height = `${newHeight}px`;

      if (scrollY > 10) {
        header.style.background = 'rgba(6, 10, 22, 0.85)';
        header.style.backdropFilter = 'blur(16px)';
        header.style.webkitBackdropFilter = 'blur(16px)';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
      } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
        header.style.borderBottom = '1px solid transparent';
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  // 3. Pointermove Spotlight glow effect for Services Cards (Modern hover trackers)
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    let rect = card.getBoundingClientRect();
    
    // Dynamic resize safety
    const resizeObserver = new ResizeObserver(() => {
      rect = card.getBoundingClientRect();
    });
    resizeObserver.observe(card);

    card.addEventListener('pointermove', (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Interactive AI Agent Lab Console Simulator
  const agentButtons = document.querySelectorAll('.agent-select-btn');
  const runBtn = document.getElementById('run-agent-btn');
  const consoleTitle = document.getElementById('console-title');
  const consoleLog = document.getElementById('console-log-output');
  const consoleStatus = document.querySelector('.console-status');

  let currentSelectedAgent = 'developer';
  let isRunningPipeline = false;

  const agentConfigurations = {
    developer: {
      filename: 'spmai_auto_coder.py',
      logs: [
        { text: '[System] Booting SPMAI DevOps Auto-Coder v2.4.1...', type: 'system' },
        { text: '[Thinking] Scanning repository for open issues...', type: 'thinking' },
        { text: '[Tool Call] git diff-tree --no-commit-id --name-only -r HEAD', type: 'tool' },
        { text: '[Tool Response] Found 4 modified modules. Checking event loop references...', type: 'response' },
        { text: '[Thinking] Discovered memory leak in async telemetry socket connections.', type: 'thinking' },
        { text: '[Execution] Refactoring telemetry.js core classes with custom weak references.', type: 'tool' },
        { text: '[System] Triggering automated testing container...', type: 'system' },
        { text: '[System] Running Jest, ESLint, and LCP-metric pipelines...', type: 'system' },
        { text: '[Tool Response] Test suites: 14 passed, 14 total. LCP budget under 1.2s.', type: 'response' },
        { text: '[Success] Telemetry weak-reference patch generated. Committing...', type: 'success' },
        { text: '[Output] Created Pull Request #147: "Refactor telemetry connection pools". Memory overhead decreased by 42%. Codebase clean!', type: 'output' }
      ]
    },
    marketing: {
      filename: 'spmai_funnel_optimizer.py',
      logs: [
        { text: '[System] Booting SPMAI Marketing Funnel Optimizer v1.12...', type: 'system' },
        { text: '[Thinking] Aggregating metric data from Google Ads & Analytics API...', type: 'thinking' },
        { text: '[Tool Call] select_ctr_rates --span="30d" --campaign="SPMAI_Enterprise"', type: 'tool' },
        { text: '[Tool Response] Avg CTR is 1.84%. Core conversion dropoff identified at service pricing layout.', type: 'response' },
        { text: '[Thinking] Designing optimal keyword map and A/B layouts based on high intent semantic indexes.', type: 'thinking' },
        { text: '[Execution] Injecting 24 semantic tokens into SEO header elements. Re-indexing page schemas...', type: 'tool' },
        { text: '[Thinking] Synthesizing new copywriting formulas. Generating micro-ad scripts.', type: 'thinking' },
        { text: '[Success] Deployed Headline B: "Automate Enterprise Operations with Multi-Agent Workflows" (Est. CTR: 3.12%).', type: 'success' },
        { text: '[Output] Programmatic SEO mappings configured. Conversion funnel leakage resolved. Expected traffic boost +28% over next cycle.', type: 'output' }
      ]
    },
    support: {
      filename: 'spmai_support_orchestrator.py',
      logs: [
        { text: '[System] Booting SPMAI Support Orchestrator Node...', type: 'system' },
        { text: '[Thinking] Listening on Zendesk, Salesforce CRM, & Jira webhook relays...', type: 'thinking' },
        { text: '[System] Intercepting Ticket #8092: "Sales pipeline contact sync mismatch".', type: 'system' },
        { text: '[Tool Call] salesforce.accounts.retrieve --id="acc_SF8923"', type: 'tool' },
        { text: '[Tool Response] Salesforce API synced: Found billing mismatch on Enterprise Tier. Promo credit balance active.', type: 'response' },
        { text: '[Thinking] Resolution path: Update Salesforce account metadata and sync invoice logs in real-time.', type: 'thinking' },
        { text: '[Execution] Syncing ledger fields. Running database reconciliation query...', type: 'tool' },
        { text: '[Success] Salesforce pipelines synchronized automatically. Notification sent to account lead.', type: 'success' },
        { text: '[Output] Sync mismatch resolved within 3.5 seconds. Salesforce records updated, zero human intervention.', type: 'output' }
      ]
    }
  };

  // Agent Selection Event
  agentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isRunningPipeline) return; // Block selecting another agent while running

      agentButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const agentId = btn.getAttribute('data-agent');
      currentSelectedAgent = agentId;

      // Update terminal UI
      consoleTitle.textContent = agentConfigurations[agentId].filename;
      consoleLog.innerHTML = `
        <div class="log-line system">[System] Connection established. Cognitive core idle.</div>
        <div class="log-line system">[System] Loaded ${agentConfigurations[agentId].filename} successfully. Click 'Run Pipeline' to execute.</div>
      `;
    });
  });

  // Run Agent Simulation
  if (runBtn && consoleLog) {
    runBtn.addEventListener('click', async () => {
      if (isRunningPipeline) return;
      
      isRunningPipeline = true;
      runBtn.disabled = true;
      runBtn.innerHTML = `<span class="pulse-dot" style="margin-right: 8px;"></span> Running Pipeline...`;
      consoleStatus.innerHTML = `<span class="pulse-dot"></span> Analyzing...`;

      // Clear console
      consoleLog.innerHTML = `<div class="log-line system">[System] Executing ${agentConfigurations[currentSelectedAgent].filename}...</div>`;

      const logsToPrint = agentConfigurations[currentSelectedAgent].logs;
      
      // Sequential typewriter logs loop
      for (let i = 0; i < logsToPrint.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        
        const line = document.createElement('div');
        line.className = `log-line ${logsToPrint[i].type}`;
        line.innerHTML = logsToPrint[i].text;
        consoleLog.appendChild(line);
        
        // Auto-scroll console
        consoleLog.scrollTop = consoleLog.scrollHeight;
      }

      // Complete execution
      isRunningPipeline = false;
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg> Run Pipeline
      `;
      consoleStatus.innerHTML = `<span class="pulse-dot" style="background:var(--color-emerald);box-shadow: 0 0 8px var(--color-emerald);"></span> Idle`;
    });
  }

  // 5. Tech Stack Tab Panel Controller
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', 'true');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const targetPanelId = btn.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.removeAttribute('hidden');
      }
    });
  });

  // 6. Impact Counters & Progress Bars Animation (on scroll-into-view)
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  const progressBars = document.querySelectorAll('.stat-progress');
  let hasAnimatedCounters = false;

  const animateStats = () => {
    statNumbers.forEach(num => {
      const target = parseFloat(num.getAttribute('data-target'));
      const duration = 1500; // 1.5 seconds
      const startTime = performance.now();
      const isPercentage = num.parentElement.id === 'stat-3' || num.parentElement.id === 'stat-4';
      
      const updateNumber = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        
        let value = easeProgress * target;
        
        if (isPercentage) {
          num.textContent = `${Math.floor(value)}%`;
        } else {
          num.textContent = `${Math.floor(value)}+`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          num.textContent = isPercentage ? `${target}%` : `${target}+`;
        }
      };

      requestAnimationFrame(updateNumber);
    });

    // Animate progress lines
    progressBars.forEach(bar => {
      const parentId = bar.closest('.stat-item').id;
      if (parentId === 'stat-1') bar.style.width = '75%';
      if (parentId === 'stat-2') bar.style.width = '85%';
      if (parentId === 'stat-3') bar.style.width = '99%';
      if (parentId === 'stat-4') bar.style.width = '90%';
    });
  };

  // High performance IntersectionObserver for stats tracking
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedCounters) {
          hasAnimatedCounters = true;
          animateStats();
          observer.unobserve(statsSection);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  }

  // 7. Accessible Form Validation & Dialog popups
  const projectForm = document.getElementById('project-form');
  const successDialog = document.getElementById('success-dialog');
  const closeDialogBtn = document.getElementById('btn-close-dialog');
  const submitBtn = document.getElementById('btn-submit');
  const formErrorMessage = document.getElementById('form-error-message');

  if (projectForm && successDialog && closeDialogBtn && submitBtn) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop standard redirect page reload
      
      // Run inputs verification (Standard validity is handled by browser HTML5 attributes)
      const isFormValid = projectForm.checkValidity();
      
      if (isFormValid) {
        // Clear any previous error messages
        if (formErrorMessage) {
          formErrorMessage.style.display = 'none';
          formErrorMessage.textContent = '';
        }

        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="pulse-dot" style="margin-right: 8px;"></span> Sending...`;

        const formData = {
          name: document.getElementById('form-name').value,
          email: document.getElementById('form-email').value,
          service: document.getElementById('form-service').value,
          message: document.getElementById('form-message').value
        };

        fetch('./send_email.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;

          if (data.success) {
            // Trigger dialog showModal
            successDialog.showModal();
            projectForm.reset(); // Reset form field values
          } else {
            // Show error banner
            if (formErrorMessage) {
              formErrorMessage.textContent = data.message || 'Failed to submit inquiry. Please try again.';
              formErrorMessage.style.display = 'block';
            } else {
              alert(data.message || 'Failed to submit inquiry. Please try again.');
            }
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          console.error('Error submitting form:', error);
          
          if (formErrorMessage) {
            formErrorMessage.textContent = 'Failed to connect to the server. Please check your network connection and try again.';
            formErrorMessage.style.display = 'block';
          } else {
            alert('Failed to connect to the server. Please check your network connection and try again.');
          }
        });
      }
    });

    closeDialogBtn.addEventListener('click', () => {
      successDialog.close();
    });
    
    // Close dialog when clicking on backdrop
    successDialog.addEventListener('click', (e) => {
      const dialogDimensions = successDialog.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        successDialog.close();
      }
    });
  }

  // 8. Dynamic Careers "Apply Now" Form Prefill & Scrolling
  const applyJobButtons = document.querySelectorAll('.apply-job-btn');
  const serviceSelect = document.getElementById('form-service');
  const messageTextarea = document.getElementById('form-message');
  const contactSection = document.getElementById('contact');

  applyJobButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobTitle = btn.getAttribute('data-job');
      const category = btn.getAttribute('data-category');

      if (serviceSelect && messageTextarea && contactSection) {
        // Pre-fill fields
        serviceSelect.value = category;
        messageTextarea.value = `Hi team, I would like to apply for the "${jobTitle}" position. Please let me know the next steps. My resume is attached in my portfolio.`;
        
        // Smooth scroll to form
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Dynamic styling to highlight the form panel briefly
        const contactPanel = document.getElementById('contact-panel');
        if (contactPanel) {
          contactPanel.style.borderColor = 'var(--color-cyan)';
          contactPanel.style.boxShadow = '0 0 25px var(--color-cyan-glow)';
          setTimeout(() => {
            contactPanel.style.borderColor = '';
            contactPanel.style.boxShadow = '';
          }, 2000);
        }
      }
    });
  });
});
