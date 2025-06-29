import React from 'react';
import {Link,useLocation} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiHome,FiChevronRight}=FiIcons;

const Breadcrumbs=()=> {
  const location=useLocation();
  const pathnames=location.pathname.split('/').filter((x)=> x);

  // Don't show breadcrumbs on homepage or admin pages
  if (location.pathname==='/' || location.pathname.startsWith('/admin')) {
    return null;
  }

  // Category name mappings
  const categoryNames={
    'herremode': 'Herremode',
    'damemode': 'Damemode',
    'boern': 'Børn',
    'sport-og-fritid': 'Sport og fritid',
    'hjemmet': 'Hjemmet',
    'elektronik': 'Elektronik',
    'voksen': 'Voksen',
    'mad-og-drikke': 'Mad og drikke',
    'rejser-og-oplevelser': 'Rejser og oplevelser'
  };

  // Generate breadcrumb items
  const generateBreadcrumbs=()=> {
    const breadcrumbs=[
      {label: 'Forside',href: '/',icon: FiHome}
    ];

    let currentPath='';
    pathnames.forEach((segment,index)=> {
      currentPath +=`/${segment}`;
      const isLast=index===pathnames.length - 1;

      // Handle different page types
      if (segment==='kategori') {
        // Skip adding "Kategorier" breadcrumb - go directly to category name
        return;
      } else if (segment==='blog') {
        breadcrumbs.push({
          label: 'Blog',
          href: currentPath,
          isActive: isLast
        });
      } else if (segment==='search') {
        breadcrumbs.push({
          label: 'Søgeresultater',
          href: currentPath,
          isActive: isLast
        });
      } else if (pathnames[index - 1]==='kategori') {
        // Category page - directly show category name without "Kategorier" parent
        const categoryName=categoryNames[segment] || segment;
        breadcrumbs.push({
          label: categoryName,
          href: currentPath,
          isActive: isLast
        });
      } else if (pathnames[index - 1]==='blog' && segment !=='blog') {
        // Blog post page
        breadcrumbs.push({
          label: 'Artikel',
          href: currentPath,
          isActive: isLast
        });
      } else {
        // Generic page
        const label=segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({
          label: label,
          href: currentPath,
          isActive: isLast
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs=generateBreadcrumbs();

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb,index)=> (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <SafeIcon icon={FiChevronRight} className="w-4 h-4 text-gray-400 mx-2" />
                )}
                {crumb.isActive ? (
                  <span className="flex items-center gap-1 text-gray-900 font-medium">
                    {crumb.icon && (
                      <SafeIcon icon={crumb.icon} className="w-4 h-4" />
                    )}
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    {crumb.icon && (
                      <SafeIcon icon={crumb.icon} className="w-4 h-4" />
                    )}
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;