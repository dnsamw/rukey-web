-- Quote requests table
CREATE TABLE quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name VARCHAR NOT NULL,
  client_email VARCHAR NOT NULL,
  client_phone VARCHAR,
  service_id UUID REFERENCES services(id),
  message TEXT,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quote_requests_client_email ON quote_requests(client_email);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
