import React, { useEffect, useRef } from 'react';
import './Modal.css';

interface SaciClass {
  codigo: string;
  nome: string;
  turma: string;
  horario: string;
  docente: string;
}

interface SaciRoom {
  nome: string;
  capacidade: number;
  tipo: string;
  acessivel: boolean;
  classes: SaciClass[];
}

interface ModalProps {
  room: SaciRoom | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ room, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 20) el.classList.add('modal-content-scrolled');
      else el.classList.remove('modal-content-scrolled');
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!room) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="modal-content" ref={contentRef} role="dialog" aria-modal="true" tabIndex={-1}>
        <div className="modal-header">
          <h2 className="modal-title">{room.nome}</h2>
          <div className="modal-tags">
            <span className="modal-badge modal-room-type">{room.tipo}</span>
            {room.acessivel && <span className="modal-badge modal-room-accessible">Acessível</span>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">&times;</button>
        </div>
        <div className="modal-room-info">
          <span><strong>Capacidade:</strong> {room.capacidade}</span>
          <span><strong>Disciplinas:</strong> {room.classes.length}</span>
        </div>
        <h3 className="modal-classes-title">Disciplinas</h3>
        {room.classes.length === 0 ? (
          <p className="modal-no-classes">Nenhuma disciplina cadastrada nesta sala.</p>
        ) : (
          <ul className="modal-classes-list">
            {room.classes.map((disc, idx) => (
              <li key={idx} className="modal-class-item">
                <span className="modal-class-nome">{disc.nome}</span>
                <span className="modal-class-preferencias">
                  {disc.codigo} • Turma {disc.turma} • {disc.horario} • {disc.docente}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Modal;
