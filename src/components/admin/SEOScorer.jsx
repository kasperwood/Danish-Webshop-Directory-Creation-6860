import React, { useMemo } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheckCircle, FiAlertCircle, FiXCircle, FiTrendingUp, FiEye, FiTarget } = FiIcons;

const SEOScorer = ({ postData }) => {
  const seoScore = useMemo(() => {
    const focusKeyword = postData.focus_keyword?.toLowerCase().trim() || '';
    
    const checks = [
      {
        id: 'focus_keyword',
        name: 'Fokus nøgleord angivet',
        check: () => {
          const hasFocusKeyword = !!focusKeyword;
          return { 
            passed: hasFocusKeyword, 
            score: hasFocusKeyword ? 5 : 0,
            message: hasFocusKeyword ? `Fokus nøgleord: "${focusKeyword}"` : 'Tilføj et fokus nøgleord for at optimere indholdet'
          };
        },
        weight: 10
      },
      {
        id: 'title_focus_keyword',
        name: 'Fokus nøgleord i titel',
        check: () => {
          if (!focusKeyword) return { passed: false, score: 0, message: 'Intet fokus nøgleord angivet' };
          const title = postData.title?.toLowerCase() || '';
          const hasKeyword = title.includes(focusKeyword);
          const isEarly = title.indexOf(focusKeyword) < 60; // Within first 60 characters
          return { 
            passed: hasKeyword && isEarly, 
            score: hasKeyword ? (isEarly ? 5 : 3) : 0,
            message: hasKeyword 
              ? (isEarly ? 'Fokus nøgleord findes tidligt i titel' : 'Fokus nøgleord i titel, men ikke tidligt nok')
              : 'Tilføj fokus nøgleord til titel'
          };
        },
        weight: 15
      },
      {
        id: 'meta_description_focus_keyword',
        name: 'Fokus nøgleord i meta beskrivelse',
        check: () => {
          if (!focusKeyword) return { passed: false, score: 0, message: 'Intet fokus nøgleord angivet' };
          const metaDesc = (postData.meta_description || postData.excerpt || '').toLowerCase();
          const hasKeyword = metaDesc.includes(focusKeyword);
          return { 
            passed: hasKeyword, 
            score: hasKeyword ? 5 : 0,
            message: hasKeyword ? 'Fokus nøgleord findes i meta beskrivelse' : 'Tilføj fokus nøgleord til meta beskrivelse'
          };
        },
        weight: 10
      },
      {
        id: 'content_focus_keyword_density',
        name: 'Fokus nøgleord tæthed (0.5-2.5%)',
        check: () => {
          if (!focusKeyword) return { passed: false, score: 0, message: 'Intet fokus nøgleord angivet' };
          const content = postData.content || '';
          const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
          
          if (wordCount === 0) return { passed: false, score: 0, message: 'Intet indhold at analysere' };
          
          // Count keyword occurrences
          const keywordRegex = new RegExp('\\b' + focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
          const matches = textContent.match(keywordRegex) || [];
          const density = (matches.length / wordCount) * 100;
          
          const optimalDensity = density >= 0.5 && density <= 2.5;
          return { 
            passed: optimalDensity, 
            score: optimalDensity ? 5 : Math.max(0, 5 - Math.abs(density - 1.5)),
            message: `Nøgleord tæthed: ${density.toFixed(2)}% (${matches.length} forekomster af ${wordCount} ord). Optimal: 0.5-2.5%`
          };
        },
        weight: 15
      },
      {
        id: 'first_paragraph_focus_keyword',
        name: 'Fokus nøgleord i første afsnit',
        check: () => {
          if (!focusKeyword) return { passed: false, score: 0, message: 'Intet fokus nøgleord angivet' };
          const content = postData.content || '';
          const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const firstParagraph = textContent.substring(0, 300).toLowerCase(); // First 300 characters
          const hasKeyword = firstParagraph.includes(focusKeyword);
          return { 
            passed: hasKeyword, 
            score: hasKeyword ? 5 : 0,
            message: hasKeyword ? 'Fokus nøgleord findes i første afsnit' : 'Tilføj fokus nøgleord til første afsnit'
          };
        },
        weight: 10
      },
      {
        id: 'headings_focus_keyword',
        name: 'Fokus nøgleord i overskrifter',
        check: () => {
          if (!focusKeyword) return { passed: false, score: 0, message: 'Intet fokus nøgleord angivet' };
          const content = postData.content || '';
          const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
          const headings = [...content.matchAll(headingRegex)].map(match => match[1].toLowerCase());
          const hasKeywordInHeading = headings.some(heading => heading.includes(focusKeyword));
          return { 
            passed: hasKeywordInHeading, 
            score: hasKeywordInHeading ? 5 : 0,
            message: hasKeywordInHeading ? 'Fokus nøgleord findes i overskrifter' : 'Tilføj fokus nøgleord til mindst én overskrift'
          };
        },
        weight: 10
      },
      {
        id: 'title_length',
        name: 'Titel længde (50-60 tegn)',
        check: () => {
          const length = postData.title?.length || 0;
          return { 
            passed: length >= 50 && length <= 60, 
            score: length >= 30 && length <= 70 ? 5 : Math.max(0, Math.min(5, length / 12)),
            message: `Nuværende: ${length} tegn. Optimal: 50-60 tegn.`
          };
        },
        weight: 8
      },
      {
        id: 'meta_description',
        name: 'Meta beskrivelse (150-160 tegn)',
        check: () => {
          const desc = postData.meta_description || postData.excerpt || '';
          const length = desc.length;
          return { 
            passed: length >= 150 && length <= 160, 
            score: length >= 120 && length <= 180 ? 5 : Math.max(0, Math.min(5, length / 32)),
            message: `Nuværende: ${length} tegn. Optimal: 150-160 tegn.`
          };
        },
        weight: 8
      },
      {
        id: 'slug_optimized',
        name: 'URL slug optimeret',
        check: () => {
          const slug = postData.slug || '';
          const hasKeyword = focusKeyword && slug.toLowerCase().includes(focusKeyword.replace(/\s+/g, '-'));
          const isOptimized = slug.length > 3 && slug.includes('-') && !slug.includes('_') && !/[A-Z]/.test(slug);
          return { 
            passed: isOptimized && hasKeyword, 
            score: (isOptimized ? 2.5 : 0) + (hasKeyword ? 2.5 : 0),
            message: `${isOptimized ? '✓ Godt format' : '✗ Brug bindestreger'}, ${hasKeyword ? '✓ Indeholder fokus nøgleord' : '✗ Mangler fokus nøgleord'}`
          };
        },
        weight: 6
      },
      {
        id: 'content_length',
        name: 'Indhold længde (min. 300 ord)',
        check: () => {
          const content = postData.content || '';
          const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
          return { 
            passed: wordCount >= 300, 
            score: Math.min(5, wordCount / 60),
            message: `${wordCount} ord. Anbefalet minimum: 300 ord for bedre SEO.`
          };
        },
        weight: 10
      },
      {
        id: 'featured_image',
        name: 'Fremhævet billede',
        check: () => {
          const hasImage = !!(postData.featured_image && postData.featured_image.startsWith('http'));
          return { 
            passed: hasImage, 
            score: hasImage ? 5 : 0,
            message: hasImage ? 'Fremhævet billede tilføjet' : 'Tilføj et fremhævet billede for bedre deling'
          };
        },
        weight: 6
      }
    ];

    let totalScore = 0;
    let maxScore = 0;
    const results = checks.map(check => {
      const result = check.check();
      const weightedScore = (result.score / 5) * check.weight;
      totalScore += weightedScore;
      maxScore += check.weight;
      
      return {
        ...check,
        ...result,
        weightedScore
      };
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    
    return {
      percentage,
      totalScore: Math.round(totalScore),
      maxScore,
      results,
      grade: percentage >= 90 ? 'Fremragende' : 
             percentage >= 80 ? 'God' : 
             percentage >= 70 ? 'Okay' : 
             percentage >= 60 ? 'Forbedring nødvendig' : 'Dårlig'
    };
  }, [postData]);

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 border-green-200';
    if (percentage >= 80) return 'bg-blue-100 border-blue-200';
    if (percentage >= 70) return 'bg-yellow-100 border-yellow-200';
    if (percentage >= 60) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getCheckIcon = (passed, score) => {
    if (passed || score >= 4) return FiCheckCircle;
    if (score >= 2) return FiAlertCircle;
    return FiXCircle;
  };

  const getCheckColor = (passed, score) => {
    if (passed || score >= 4) return 'text-green-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">SEO Score</h3>
      </div>

      {/* Focus Keyword Display */}
      {postData.focus_keyword && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <SafeIcon icon={FiTarget} className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Fokus Nøgleord:</span>
          </div>
          <span className="text-blue-800 font-semibold">"{postData.focus_keyword}"</span>
        </div>
      )}

      {/* Overall Score */}
      <div className={`border rounded-lg p-4 mb-4 ${getScoreBgColor(seoScore.percentage)}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Samlet SEO Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor(seoScore.percentage)}`}>
            {seoScore.percentage}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              seoScore.percentage >= 90 ? 'bg-green-500' :
              seoScore.percentage >= 80 ? 'bg-blue-500' :
              seoScore.percentage >= 70 ? 'bg-yellow-500' :
              seoScore.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${seoScore.percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${getScoreColor(seoScore.percentage)}`}>
            {seoScore.grade}
          </span>
          <span className="text-xs text-gray-600">
            {seoScore.totalScore}/{seoScore.maxScore} point
          </span>
        </div>
      </div>

      {/* Detailed Checks */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <SafeIcon icon={FiEye} className="w-4 h-4" />
          Detaljeret Analyse
        </h4>
        
        {seoScore.results.map((result) => (
          <div key={result.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <SafeIcon 
              icon={getCheckIcon(result.passed, result.score)} 
              className={`w-4 h-4 mt-0.5 ${getCheckColor(result.passed, result.score)}`} 
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-gray-900">{result.name}</span>
                <span className="text-xs text-gray-500">{Math.round(result.weightedScore)}/{result.weight}</span>
              </div>
              <p className="text-xs text-gray-600">{result.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SEO Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">💡 SEO Tips:</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Brug dit fokus nøgleord naturligt gennem hele teksten</li>
          <li>• Placer fokus nøgleord tidligt i titel og første afsnit</li>
          <li>• Undgå keyword stuffing - hold tætheden mellem 0.5-2.5%</li>
          <li>• Brug variationer og synonymer af dit fokus nøgleord</li>
        </ul>
      </div>
    </div>
  );
};

export default SEOScorer;