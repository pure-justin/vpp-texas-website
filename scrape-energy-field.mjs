import puppeteer from 'puppeteer';

(async () => {
  // Launch Chrome (not headless so you can login)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  // Navigate to the page
  await page.goto('https://app.subcontractorhub.com/pure-energy-inc/customers/add', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('\n=== PAGE LOADED ===');
  console.log('Please login if needed, then press Enter in this terminal when ready...\n');
  
  // Wait for user input after login
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  console.log('Analyzing page...\n');

  // Get all form fields
  const formData = await page.evaluate(() => {
    const results = {
      inputs: [],
      selects: [],
      scripts: [],
      networkHints: []
    };

    // Find all input fields
    document.querySelectorAll('input, select, textarea').forEach(el => {
      results.inputs.push({
        type: el.type || el.tagName.toLowerCase(),
        name: el.name,
        id: el.id,
        placeholder: el.placeholder,
        className: el.className,
        'data-attributes': Object.keys(el.dataset).map(k => `data-${k}=${el.dataset[k]}`).join(', ')
      });
    });

    // Look for anything mentioning "energy community"
    const allText = document.body.innerHTML;
    const energyMatches = allText.match(/energy.?community|ffe|fossil.?fuel|unemployment/gi);
    if (energyMatches) {
      results.energyMentions = [...new Set(energyMatches)];
    }

    // Find any API endpoints in scripts
    document.querySelectorAll('script').forEach(script => {
      const src = script.src || '';
      const content = script.textContent || '';
      if (content.includes('api') || content.includes('fetch') || content.includes('axios')) {
        const apiMatches = content.match(/https?:\/\/[^\s"']+api[^\s"']*/gi);
        if (apiMatches) {
          results.scripts.push(...apiMatches);
        }
      }
    });

    return results;
  });

  console.log('=== FORM FIELDS ===');
  formData.inputs.forEach(input => {
    if (input.name || input.id || input.placeholder) {
      console.log(`- ${input.type}: name="${input.name}" id="${input.id}" placeholder="${input.placeholder}"`);
      if (input['data-attributes']) console.log(`  data: ${input['data-attributes']}`);
    }
  });

  if (formData.energyMentions) {
    console.log('\n=== ENERGY COMMUNITY MENTIONS ===');
    console.log(formData.energyMentions);
  }

  if (formData.scripts.length) {
    console.log('\n=== API ENDPOINTS FOUND ===');
    formData.scripts.forEach(s => console.log(s));
  }

  // Monitor network requests
  console.log('\n=== MONITORING NETWORK REQUESTS ===');
  console.log('Try interacting with the energy community field...\n');

  page.on('request', request => {
    const url = request.url();
    if (url.includes('energy') || url.includes('community') || url.includes('census') || 
        url.includes('ffe') || url.includes('bls') || url.includes('netl') || url.includes('nrel')) {
      console.log('REQUEST:', request.method(), url);
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('energy') || url.includes('community') || url.includes('census') ||
        url.includes('ffe') || url.includes('bls') || url.includes('netl') || url.includes('nrel')) {
      console.log('RESPONSE:', response.status(), url);
      try {
        const text = await response.text();
        if (text.length < 2000) {
          console.log('BODY:', text.substring(0, 500));
        }
      } catch (e) {}
    }
  });

  // Keep browser open for manual inspection
  console.log('Browser will stay open. Press Ctrl+C to exit.\n');
  await new Promise(() => {}); // Keep running
})();
