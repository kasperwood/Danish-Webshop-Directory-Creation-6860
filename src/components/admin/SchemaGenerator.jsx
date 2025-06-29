import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCode, FiCopy, FiCheck, FiX, FiHelpCircle } = FiIcons;

const SchemaGenerator = ({ onGenerate, onClose }) => {
  const [step, setStep] = useState(1);
  const [schemaData, setSchemaData] = useState({
    type: 'Article',
    headline: '',
    description: '',
    author: 'Webshop Oversigt',
    publisher: 'Webshop Oversigt',
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    image: '',
    url: '',
    keywords: '',
    articleSection: '',
    wordCount: '',
    readingTime: '5 min',
    rating: '',
    reviewCount: '',
    aboutWebshops: []
  });
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [copied, setCopied] = useState(false);

  const schemaTypes = [
    { value: 'Article', label: 'Artikel', description: 'Standard blog artikel' },
    { value: 'Review', label: 'Anmeldelse', description: 'Produktanmeldelse eller webshop anmeldelse' },
    { value: 'HowTo', label: 'Guide', description: 'Step-by-step guide eller tutorial' },
    { value: 'FAQPage', label: 'FAQ', description: 'Ofte stillede spørgsmål' }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateSchema = () => {
    let schema = {
      "@context": "https://schema.org",
      "@type": schemaData.type,
      "headline": schemaData.headline,
      "description": schemaData.description,
      "author": {
        "@type": "Person",
        "name": schemaData.author
      },
      "publisher": {
        "@type": "Organization",
        "name": schemaData.publisher,
        "logo": {
          "@type": "ImageObject",
          "url": "https://webshop-oversigt.dk/logo.png"
        }
      },
      "datePublished": schemaData.datePublished,
      "dateModified": schemaData.dateModified,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": schemaData.url
      }
    };

    if (schemaData.image) {
      schema.image = {
        "@type": "ImageObject",
        "url": schemaData.image,
        "width": 1200,
        "height": 630
      };
    }

    if (schemaData.keywords) {
      schema.keywords = schemaData.keywords.split(',').map(k => k.trim());
    }

    if (schemaData.wordCount) {
      schema.wordCount = parseInt(schemaData.wordCount);
    }

    // Type-specific fields
    if (schemaData.type === 'Review') {
      schema.itemReviewed = {
        "@type": "Thing",
        "name": schemaData.headline
      };
      if (schemaData.rating) {
        schema.reviewRating = {
          "@type": "Rating",
          "ratingValue": schemaData.rating,
          "bestRating": "5"
        };
      }
    }

    if (schemaData.type === 'HowTo') {
      schema.totalTime = schemaData.readingTime;
      schema.supply = schemaData.aboutWebshops.map(webshop => ({
        "@type": "HowToSupply",
        "name": webshop
      }));
    }

    if (schemaData.type === 'FAQPage') {
      schema.mainEntity = [
        {
          "@type": "Question",
          "name": "Hvordan finder jeg de bedste webshops?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Se efter e-mærket certificering, læs Trustpilot anmeldelser og sammenlign priser."
          }
        }
      ];
    }

    const schemaString = JSON.stringify(schema, null, 2);
    setGeneratedSchema(schemaString);
    setStep(4);
  };

  const copySchema = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseSchema = () => {
    onGenerate(generatedSchema);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <SafeIcon icon={FiCode} className="w-5 h-5" />
              Schema Markup Generator
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Schema Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Vælg Schema Type</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {schemaTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSchemaData({ ...schemaData, type: type.value })}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        schemaData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4">Grundlæggende Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artikel Overskrift *
                  </label>
                  <input
                    type="text"
                    value={schemaData.headline}
                    onChange={(e) => setSchemaData({ ...schemaData, headline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Guide til de bedste danske webshops"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forfatter
                  </label>
                  <input
                    type="text"
                    value={schemaData.author}
                    onChange={(e) => setSchemaData({ ...schemaData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskrivelse *
                </label>
                <textarea
                  value={schemaData.description}
                  onChange={(e) => setSchemaData({ ...schemaData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Komplet guide til at finde de bedste og mest pålidelige danske webshops..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publikationsdato
                  </label>
                  <input
                    type="date"
                    value={schemaData.datePublished}
                    onChange={(e) => setSchemaData({ ...schemaData, datePublished: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sidst opdateret
                  </label>
                  <input
                    type="date"
                    value={schemaData.dateModified}
                    onChange={(e) => setSchemaData({ ...schemaData, dateModified: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billede URL
                </label>
                <input
                  type="url"
                  value={schemaData.image}
                  onChange={(e) => setSchemaData({ ...schemaData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Advanced Options */}
          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4">Avancerede Indstillinger</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nøgleord (komma-separeret)
                </label>
                <input
                  type="text"
                  value={schemaData.keywords}
                  onChange={(e) => setSchemaData({ ...schemaData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="danske webshops, online shopping, e-handel"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordantal (cirka)
                  </label>
                  <input
                    type="number"
                    value={schemaData.wordCount}
                    onChange={(e) => setSchemaData({ ...schemaData, wordCount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Læsetid
                  </label>
                  <input
                    type="text"
                    value={schemaData.readingTime}
                    onChange={(e) => setSchemaData({ ...schemaData, readingTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5 min"
                  />
                </div>
              </div>

              {/* Conditional fields based on schema type */}
              {schemaData.type === 'Review' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedømmelse (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={schemaData.rating}
                      onChange={(e) => setSchemaData({ ...schemaData, rating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antal anmeldelser
                    </label>
                    <input
                      type="number"
                      value={schemaData.reviewCount}
                      onChange={(e) => setSchemaData({ ...schemaData, reviewCount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webshops omtalt i artiklen (en per linje)
                </label>
                <textarea
                  value={schemaData.aboutWebshops.join('\n')}
                  onChange={(e) => setSchemaData({ 
                    ...schemaData, 
                    aboutWebshops: e.target.value.split('\n').filter(w => w.trim()) 
                  })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Zalando&#10;H&M&#10;Elgiganten"
                />
              </div>
            </div>
          )}

          {/* Step 4: Generated Schema */}
          {step === 4 && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold mb-4">Genereret Schema Markup</h4>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">JSON-LD Schema:</span>
                  <button
                    onClick={copySchema}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                    {copied ? 'Kopieret!' : 'Kopier'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto max-h-96">
                  {generatedSchema}
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <SafeIcon icon={FiHelpCircle} className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900">Om Schema Markup</h5>
                    <p className="text-sm text-blue-800 mt-1">
                      Schema markup hjælper søgemaskiner med at forstå dit indhold bedre og kan resultere i rige uddrag (rich snippets) i søgeresultaterne.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Forrige
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {step < 3 && (
                <button
                  onClick={handleNext}
                  disabled={(step === 1 && !schemaData.type) || (step === 2 && (!schemaData.headline || !schemaData.description))}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Næste
                </button>
              )}
              {step === 3 && (
                <button
                  onClick={generateSchema}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generer Schema
                </button>
              )}
              {step === 4 && (
                <button
                  onClick={handleUseSchema}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Brug Schema
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchemaGenerator;