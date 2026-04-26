import React, { useState, useEffect, useMemo } from 'react';
import { read, utils } from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, ChevronUp, ChevronDown, Database, Columns, X, Filter, ArrowUp, ArrowDown } from 'lucide-react';

const isImageUrl = (url) => {
  if (typeof url !== 'string') return false;
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url) || url.startsWith('data:image/');
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterColumn, setFilterColumn] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the local excel file dynamically
        const url = '/Uchagaon_Voters_2026 (2).csv';
        const response = await fetch(url);
        
        if (!response.ok) {
           throw new Error('Failed to fetch the file.');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = read(arrayBuffer, { type: 'array' });
        
        // Take the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = utils.sheet_to_json(worksheet, { defval: '' });
        
        if (jsonData.length > 0) {
          // Extract column headers from the first object
          const cols = Object.keys(jsonData[0]);
          setColumns(cols);
          setData(jsonData);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Search filtering
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      processedData = processedData.filter((row) => {
        if (filterColumn !== 'All') {
          return String(row[filterColumn] || '').toLowerCase().includes(lowercasedTerm);
        }
        return Object.values(row).some((value) => 
          String(value || '').toLowerCase().includes(lowercasedTerm)
        );
      });
    }

    // Sorting
    if (sortConfig.key !== null) {
      processedData.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        // Handle numeric sorting
        const numA = Number(valA);
        const numB = Number(valB);
        
        if (!isNaN(numA) && !isNaN(numB) && valA !== '' && valB !== '' && valA !== null && valB !== null) {
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }
        
        // String sorting
        const strA = String(valA || '').toLowerCase();
        const strB = String(valB || '').toLowerCase();
        
        if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processedData;
  }, [data, searchTerm, filterColumn, sortConfig]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2 style={{fontSize: '1.25rem', fontWeight: 600}}>Loading Dataset...</h2>
        <p>Parsing Excel data efficiently</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <div className="container header-content">
          <h1 className="login-title" style={{ fontSize: '2rem', margin: 0, paddingRight: '1rem' }}>BJP Vikas Aghadi</h1>
          
          <div className="controls-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', width: '100%', maxWidth: '800px', justifyContent: 'flex-end' }}>
            <div className="search-container" style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                className="input-custom search-input" 
                placeholder={filterColumn === 'All' ? "Search across all columns..." : `Search in ${filterColumn}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-select-container" style={{ position: 'relative', minWidth: '160px' }}>
              <Filter className="search-icon" size={18} style={{ left: '0.75rem' }} />
              <select 
                className="input-custom" 
                style={{ paddingLeft: '2.5rem', appearance: 'none', cursor: 'pointer' }}
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                <option value="All">All Columns</option>
                {columns.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
              <ChevronDown size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            <div className="sort-select-container" style={{ position: 'relative', minWidth: '160px', display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: '1' }}>
                <ArrowUpDown className="search-icon" size={18} style={{ left: '0.75rem' }} />
                <select 
                  className="input-custom" 
                  style={{ paddingLeft: '2.5rem', appearance: 'none', cursor: 'pointer' }}
                  value={sortConfig.key || ''}
                  onChange={(e) => setSortConfig({ key: e.target.value || null, direction: sortConfig.direction })}
                >
                  <option value="">Sort By...</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
                <ChevronDown size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
              
              {sortConfig.key && (
                <button 
                  className="btn" 
                  style={{ 
                    padding: '0 0.75rem', 
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--border-color)',
                    color: 'var(--primary-color)'
                  }}
                  onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                  title={`Toggle sort direction (currently ${sortConfig.direction})`}
                >
                  {sortConfig.direction === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container animate-fade-in" style={{paddingTop: '2rem'}}>
        <div className="stats-bar" style={{paddingTop: '0'}}>
          <div className="stat-item">
            <Database size={16} color="var(--primary-color)" />
            <strong>Total Records:</strong> {data.length}
          </div>
          <div className="stat-item">
            <Search size={16} color="var(--primary-color)" />
            <strong>Filtered Results:</strong> {filteredAndSortedData.length}
          </div>
          <div className="stat-item">
            <Columns size={16} color="var(--primary-color)" />
            <strong>Columns Detected:</strong> {columns.length}
          </div>
        </div>

        {filteredAndSortedData.length === 0 ? (
          <div className="no-results">
            <Search size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h2>No results found</h2>
            <p>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} onClick={() => handleSort(col)}>
                        <div className="th-content">
                          {col}
                          {sortConfig.key === col ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} color="var(--primary-color)" /> : <ChevronDown size={14} color="var(--primary-color)" />
                          ) : (
                            <ArrowUpDown size={14} color="var(--border-color)" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => {
                        const cellValue = row[col];
                        return (
                          <td key={`${rowIndex}-${colIndex}`}>
                            {isImageUrl(cellValue) ? (
                              <img 
                                src={cellValue} 
                                alt={`Thumbnail ${rowIndex}`} 
                                className="thumbnail"
                                onClick={() => setSelectedImage(cellValue)}
                              />
                            ) : (
                              // Detect URL that is not an image and make it clickable
                              String(cellValue).startsWith('http') && !String(cellValue).includes(' ') ? 
                                <a href={cellValue} target="_blank" rel="noopener noreferrer" className="text-link">
                                  {cellValue}
                                </a> : 
                                (cellValue === '' ? <span style={{color: 'var(--text-secondary)', opacity: 0.5}}>-</span> : cellValue)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Image Modal for viewing clicked thumbnail */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedImage(null)}>
                <X size={24} />
              </button>
              <img src={selectedImage} alt="Expanded preview" className="modal-image" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
